param(
    [string]$Source = "C:\serwer\htdocs\moj_projek\eCVjob.pl\src",
    [string]$Destination = "C:\serwer\htdocs\ecvjob",
    [switch]$Mirror,
    [switch]$WhatIf,
    [string]$LogPath = "C:\serwer\htdocs\moj_projek\eCVjob.pl\tools\sync_log.txt"
)

# Create destination if missing
if (!(Test-Path -LiteralPath $Destination)) {
    New-Item -ItemType Directory -Path $Destination -Force | Out-Null
}

# Ensure log directory exists
$logDir = Split-Path -Parent $LogPath
if (!(Test-Path -LiteralPath $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }

$timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
"[$timestamp] Starting sync from '$Source' to '$Destination' (Mirror=$($Mirror.IsPresent))" | Tee-Object -FilePath $LogPath -Append | Out-Null

# Build robocopy options
$opts = @('/E','/XO','/R:1','/W:1','/NFL','/NDL','/NP','/NS','/NC')
if ($Mirror) { $opts += '/MIR' }
$opts += @('/XD','.git','.vscode','node_modules')

$cmd = @('robocopy', '"{0}"' -f $Source, '"{0}"' -f $Destination) + $opts

if ($WhatIf) {
    "[$timestamp] WhatIf: $($cmd -join ' ')" | Tee-Object -FilePath $LogPath -Append | Out-Null
    Write-Host "WhatIf mode: command would be: $($cmd -join ' ')"
    exit 0
}

# Run robocopy
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = 'robocopy'
$psi.Arguments = '"{0}" "{1}" {2}' -f $Source, $Destination, ($opts -join ' ')
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.UseShellExecute = $false
$proc = [System.Diagnostics.Process]::Start($psi)
$stdout = $proc.StandardOutput.ReadToEnd()
$stderr = $proc.StandardError.ReadToEnd()
$proc.WaitForExit()

$exitCode = $proc.ExitCode
"[$timestamp] robocopy exit code: $exitCode" | Tee-Object -FilePath $LogPath -Append | Out-Null
$stdout | Tee-Object -FilePath $LogPath -Append | Out-Null
if ($stderr) { $stderr | Tee-Object -FilePath $LogPath -Append | Out-Null }

# Robocopy exit codes 0-7 are success-ish
if ($exitCode -gt 7) {
    Write-Error "robocopy failed with exit code $exitCode. See log: $LogPath"
    exit $exitCode
} else {
    Write-Host "Sync completed. Exit code: $exitCode. Log: $LogPath"
    exit 0
}
