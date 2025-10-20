param(
    [string]$TaskName = 'eCVjob Sync',
    [string]$ScriptPath = 'C:\serwer\htdocs\moj_projek\eCVjob.pl\tools\Sync-ecvjob.ps1',
    [string]$WorkingDir = 'C:\serwer\htdocs\moj_projek\eCVjob.pl\tools',
    [int]$EveryMinutes = 10
)

$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$ScriptPath`" -Mirror"
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes $EveryMinutes) -RepetitionDuration ([TimeSpan]::MaxValue)
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType InteractiveToken -RunLevel Highest
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

try {
    Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -ErrorAction Stop
    Write-Host "Zadanie harmonogramu zarejestrowane: $TaskName (co $EveryMinutes min)"
} catch {
    Write-Error "Nie udało się zarejestrować zadania: $_"
}
