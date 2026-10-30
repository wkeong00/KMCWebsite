Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$brand = Join-Path $root 'src/Assets/brand'
$public = Join-Path $root 'public'
New-Item -ItemType Directory -Force $brand | Out-Null
$teal = '#0e4a52'
$culture = [Globalization.CultureInfo]::InvariantCulture
$utf8 = New-Object Text.UTF8Encoding($false)
# Approved A: connected KMC, with open counters between the folded strokes.
$polygons = @('0,32 46,0 46,196 0,196','50,84 132,18 201,70 270,18 377,18 420,60 303,60 303,154 377,154 420,196 260,196 260,86 201,133 132,83 50,147','50,153 82,126 168,196 105,196','132,96 174,129 174,188 132,154','218,128 254,99 254,196 218,196')
$mark = New-Object Drawing.Drawing2D.GraphicsPath
foreach ($polygon in $polygons) {
 [Drawing.PointF[]]$points = $polygon.Split(' ') | ForEach-Object { $xy=$_.Split(','); New-Object Drawing.PointF([float]$xy[0],[float]$xy[1]) }
 $mark.AddPolygon($points)
}
$markSvg = ($polygons | ForEach-Object { '<polygon points="'+$_+'"/>' }) -join ''
function Outline($text,$spacing,$bold) {
 $path=New-Object Drawing.Drawing2D.GraphicsPath; $path.FillMode=[Drawing.Drawing2D.FillMode]::Winding
 $family=New-Object Drawing.FontFamily('Bahnschrift')
 $style=if($bold){1}else{0}
 $cursor=0
 foreach($letter in $text.ToCharArray()) {
  if($letter -eq ' '){$cursor+=35;continue}
  $glyph=New-Object Drawing.Drawing2D.GraphicsPath; $glyph.FillMode=[Drawing.Drawing2D.FillMode]::Winding
  $glyph.AddString([string]$letter,$family,$style,100,[Drawing.PointF]::Empty,[Drawing.StringFormat]::GenericTypographic)
  $bounds=$glyph.GetBounds()
  $matrix=New-Object Drawing.Drawing2D.Matrix
  $matrix.Translate(($cursor-$bounds.X),0)
  $glyph.Transform($matrix);$path.AddPath($glyph,$false)
  $cursor+=$bounds.Width+$spacing
  $matrix.Dispose();$glyph.Dispose()
 }
 $family.Dispose()
 return ,$path
}
function Fit($path,$x,$y,$width,$height) {
 $b=$path.GetBounds();$sx=$width/$b.Width;$sy=$height/$b.Height
 $matrix=New-Object Drawing.Drawing2D.Matrix($sx,0,0,$sy,($x-$b.X*$sx),($y-$b.Y*$sy))
 $path.Transform($matrix);$matrix.Dispose()
}
function SvgPath($path) {
 $p=$path.PathPoints;$t=$path.PathTypes;$out=New-Object 'Collections.Generic.List[string]'
 function Point($v){$v.X.ToString('0.###',$culture)+','+$v.Y.ToString('0.###',$culture)}
 for($i=0;$i -lt $p.Length;$i++) {
  switch($t[$i] -band 7) {
   0 {$out.Add('M'+(Point $p[$i]))}
   1 {$out.Add('L'+(Point $p[$i]))}
   3 {$out.Add('C'+(Point $p[$i])+' '+(Point $p[$i+1])+' '+(Point $p[$i+2]));$i+=2}
  }
  if(($t[$i] -band 128) -ne 0){$out.Add('Z')}
 }
 return $out -join ' '
}
function Svg($path,$box,$content){[IO.File]::WriteAllText($path,'<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+$box+'">'+$content+'</svg>'+"`n",$utf8)}
$name=Outline 'KMC 63' 6 $true
Fit $name 470 30 650 97
$trading=Outline 'TRADING' 54 $false
Fit $trading 478 158 634 31
$word='<path d="'+(SvgPath $name)+'"/><path d="'+(SvgPath $trading)+'"/>'
Svg (Join-Path $brand 'kmc-mark.svg') '0 0 420 196' ('<g fill="'+$teal+'">'+$markSvg+'</g>')
Svg (Join-Path $brand 'kmc-wordmark.svg') '460 20 670 180' ('<g fill="'+$teal+'">'+$word+'</g>')
foreach($variant in @(@('kmc-logo.svg',$teal),@('kmc-logo-light.svg','#ffffff'))) {
 Svg (Join-Path $brand $variant[0]) '0 0 1120 210' ('<g fill="'+$variant[1]+'"><g transform="translate(0 7)">'+$markSvg+'</g>'+$word+'</g>')
}
Svg (Join-Path $public 'favicon.svg') '0 0 512 512' ('<rect width="512" height="512" rx="96" fill="'+$teal+'"/><g fill="#ffffff" transform="translate(38 154) scale(1.038)">'+$markSvg+'</g>')
function IconBitmap($size) {
 $bitmap=New-Object Drawing.Bitmap($size,$size)
 $g=[Drawing.Graphics]::FromImage($bitmap)
 $g.SmoothingMode=[Drawing.Drawing2D.SmoothingMode]::AntiAlias
 $g.Clear([Drawing.ColorTranslator]::FromHtml($teal))
 $g.ScaleTransform(($size/512.0),($size/512.0));$g.TranslateTransform(38,154);$g.ScaleTransform(1.038,1.038)
 $g.FillPath([Drawing.Brushes]::White,$mark);$g.Dispose()
 return ,$bitmap
}
foreach($spec in @(@('favicon-32.png',32),@('favicon-96.png',96),@('apple-touch-icon.png',180),@('logo192.png',192),@('customfavicon.png',192),@('logo512.png',512))) {
 $bitmap=IconBitmap $spec[1];$bitmap.Save((Join-Path $public $spec[0]),[Drawing.Imaging.ImageFormat]::Png);$bitmap.Dispose()
}
$entries=@()
foreach($size in @(16,32,48,256)) {
 $bitmap=IconBitmap $size;$stream=New-Object IO.MemoryStream
 $bitmap.Save($stream,[Drawing.Imaging.ImageFormat]::Png)
 $entries+=,@($size,$stream.ToArray());$bitmap.Dispose();$stream.Dispose()
}
$file=[IO.File]::Create((Join-Path $public 'favicon.ico'));$writer=New-Object IO.BinaryWriter($file)
$writer.Write([uint16]0);$writer.Write([uint16]1);$writer.Write([uint16]$entries.Count)
$offset=6+16*$entries.Count
foreach($entry in $entries) {
 $dimension=if($entry[0] -eq 256){0}else{$entry[0]}
 $writer.Write([byte]$dimension);$writer.Write([byte]$dimension);$writer.Write([byte]0);$writer.Write([byte]0)
 $writer.Write([uint16]1);$writer.Write([uint16]32);$writer.Write([uint32]$entry[1].Length);$writer.Write([uint32]$offset)
 $offset+=$entry[1].Length
}
foreach($entry in $entries){$writer.Write([byte[]]$entry[1])}
$writer.Dispose();$file.Dispose()
# Local review image uses the same geometry and outlined letters as the SVG files.
$reviewDir=Join-Path $root 'artifacts/brand'
New-Item -ItemType Directory -Force $reviewDir | Out-Null
$preview=New-Object Drawing.Bitmap(1200,480)
$g=[Drawing.Graphics]::FromImage($preview)
$g.SmoothingMode=[Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([Drawing.Color]::White)
$g.FillRectangle((New-Object Drawing.SolidBrush([Drawing.ColorTranslator]::FromHtml($teal))),0,240,1200,240)
foreach($row in @(0,1)) {
 $g.ResetTransform();$g.TranslateTransform(40,(30+240*$row))
 $brush=if($row -eq 0){New-Object Drawing.SolidBrush([Drawing.ColorTranslator]::FromHtml($teal))}else{[Drawing.Brushes]::White}
 $g.TranslateTransform(0,7);$g.FillPath($brush,$mark);$g.TranslateTransform(0,-7)
 $g.FillPath($brush,$name);$g.FillPath($brush,$trading)
}
$preview.Save((Join-Path $reviewDir 'kmc-logo-preview.png'),[Drawing.Imaging.ImageFormat]::Png)
$g.Dispose();$preview.Dispose();$mark.Dispose();$name.Dispose();$trading.Dispose()
Write-Output 'KMC SVG identity and PNG/ICO icons generated.'
