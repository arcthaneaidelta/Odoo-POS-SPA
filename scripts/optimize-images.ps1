Add-Type -AssemblyName System.Drawing
$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 78L)
$targets = @{ 'hero-interior.jpg' = 860; 'approach-navigation.jpg' = 900; 'approach-coordination.jpg' = 900 }
foreach ($name in $targets.Keys) {
  $path = Join-Path (Join-Path $PSScriptRoot '..\public\images') $name
  $src = [System.Drawing.Image]::FromFile($path)
  $w = $targets[$name]
  if ($src.Width -le $w) { $src.Dispose(); continue }
  $h = [int]($src.Height * $w / $src.Width)
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.DrawImage($src, 0, 0, $w, $h)
  $g.Dispose(); $src.Dispose()
  $tmp = "$path.tmp"
  $bmp.Save($tmp, $jpeg, $params)
  $bmp.Dispose()
  Move-Item -Force $tmp $path
}
