param([switch]$NoBrowser)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$previewUrl = 'http://127.0.0.1:4174'
$gate = New-Object System.Threading.Mutex($false, 'Local\FengjianWebsiteLauncher4174')
$locked = $false
function Get-Preview {
    # 绕过代理只针对本次本机请求，不写系统配置。
    $request = [Net.HttpWebRequest]::Create("$previewUrl/__fengjian_health")
    $request.Proxy = $null
    $request.Timeout = 1500
    $request.ReadWriteTimeout = 1500
    $response = $null
    $reader = $null
    try {
        $response = $request.GetResponse()
        $reader = New-Object IO.StreamReader($response.GetResponseStream(), [Text.Encoding]::UTF8)
        return ($reader.ReadToEnd() | ConvertFrom-Json)
    }
    catch { return $null }
    finally {
        if ($reader) { $reader.Dispose() }
        if ($response) { $response.Dispose() }
    }
}
try {
    try { $locked = $gate.WaitOne(20000) } catch [System.Threading.AbandonedMutexException] { $locked = $true }
    if (!$locked) { throw 'Another website launch is still in progress.' }
    $status = Get-Preview
    $expectedRoot = [IO.Path]::GetFullPath((Join-Path $projectRoot 'dist\client'))
    if ($status -and ($status.app -ne 'fengjian-preview' -or $status.root.TrimEnd('\','/') -ne $expectedRoot)) {
        throw 'Port 4174 belongs to another project. No process was stopped.'
    }
    if (!$status) {
        $probe = New-Object Net.Sockets.TcpClient
        try {
            $attempt = $probe.ConnectAsync('127.0.0.1', 4174)
            try { $null = $attempt.Wait(500) } catch {}
            if ($probe.Connected) { throw 'Port 4174 is occupied by another service. No port change was made.' }
        } finally { $probe.Dispose() }
        if (!(Test-Path -LiteralPath (Join-Path $expectedRoot 'index.html'))) { throw 'Website build missing. Build the project first.' }
        $nodePath = (Get-Command node.exe -ErrorAction Stop).Source
        $logRoot = Join-Path $projectRoot 'logs'
        $null = New-Item -ItemType Directory -Force -Path $logRoot
        # 隐藏启动，启动器退出后服务继续按需运行；不注册开机任务。
        $process = Start-Process -FilePath $nodePath -ArgumentList ('"' + (Join-Path $PSScriptRoot 'local-preview.mjs') + '"') -WorkingDirectory $projectRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logRoot 'preview.stdout.log') -RedirectStandardError (Join-Path $logRoot 'preview.stderr.log')
        for ($tryCount = 0; $tryCount -lt 40; $tryCount++) {
            Start-Sleep -Milliseconds 250
            $status = Get-Preview
            if ($status) { break }
            if ($process.HasExited) { throw 'Preview failed to start. See logs/preview.stderr.log.' }
        }
        if (!$status -or $status.app -ne 'fengjian-preview') { throw 'Preview did not become ready within 10 seconds.' }
    }
    if (!$NoBrowser) { Start-Process "$previewUrl/#home" }
    Write-Output "Website ready: $previewUrl/#home (PID $($status.pid))"
} catch {
    if ($NoBrowser) { throw }
    Add-Type -AssemblyName System.Windows.Forms
    [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, 'Website preview') | Out-Null
    exit 1
} finally {
    if ($locked) { $gate.ReleaseMutex() }
    $gate.Dispose()
}
