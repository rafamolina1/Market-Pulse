param (
    [string]$Source,
    [string]$Destination,
    [int]$Size
)

Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Image]::FromFile($Source)
$canvas = New-Object System.Drawing.Bitmap $Size, $Size
$graph = [System.Drawing.Graphics]::FromImage($canvas)

$graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$graph.DrawImage($img, 0, 0, $Size, $Size)
$canvas.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)

$img.Dispose()
$canvas.Dispose()
$graph.Dispose()
