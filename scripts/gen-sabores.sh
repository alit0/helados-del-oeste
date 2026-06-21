#!/usr/bin/env bash
# Generates one scoop image per "Sabores por Peso" flavor on a white background.
set -u
cd "C:/Users/Ale/Proyectos/Helados-del-oeste" || exit 1
mkdir -p public/sabores
OUT=public/sabores
PRE="Studio product photo of a single generous scoop of"
POST="ice cream in a small white paper cup, plain pure white seamless background, photo style, shot on 50mm lens, soft diffused studio light, slightly angled top view, sharp focus on the ice cream texture, centered"

# id|visual description
items=(
"hdo-p02|rich brown chocolate"
"hdo-p14|dark chocolate with chocolate shavings"
"hdo-p22|brown chocotorta with cookie pieces and dulce de leche swirl"
"hdo-p25|chocolate with pistachio green swirl and golden crunchy bits"
"hdo-p27|three tone dark, milk and white chocolate"
"hdo-p11|intense caramel dulce de leche"
"hdo-p15|caramel dulce de leche with dark chocolate chips"
"hdo-p04|smooth caramel dulce de leche"
"hdo-p24|caramel dulce de leche with thick caramel swirls"
"hdo-p29|caramel dulce de leche with chocolate bonbon pieces"
"hdo-p17|white cream with dark chocolate chips"
"hdo-p19|mint green with dark chocolate chips"
"hdo-p01|pale cream vanilla"
"hdo-p03|light blue and white swirl cream"
"hdo-p05|pink strawberry cream with strawberry pieces"
"hdo-p13|white whipped cream with fresh strawberry pieces"
"hdo-p07|classic pale yellow vanilla"
"hdo-p21|pink strawberry with chocolate chunks"
"hdo-p20|cream with red berries and chocolate pieces"
"hdo-p12|yellow banana with strawberry and chocolate"
"hdo-p16|creamy flan colored with caramel sauce"
"hdo-p31|white mascarpone cream with red berries"
"hdo-p30|chocolate hazelnut spread cream"
"hdo-p23|cream with chocolate and cookie pieces"
"hdo-p28|beige peanut nougat mantecol"
"hdo-p06|pale yellow lemon sorbet"
"hdo-p08|orange and mango sorbet"
"hdo-p09|pink strawberry and green kiwi sorbet"
"hdo-p10|pale yellow pineapple sorbet"
"hdo-p18|pale yellow lemon sorbet with macerated strawberry pieces"
)

n=0
for it in "${items[@]}"; do
  id="${it%%|*}"; desc="${it#*|}"; n=$((n+1))
  echo ">>> [$n/${#items[@]}] $id ($desc)"
  for try in 1 2; do
    url=$(hf generate create gpt_image_2 --prompt "$PRE $desc $POST" --aspect_ratio 1:1 --quality high --resolution 1k --wait --wait-timeout 5m --json 2>&1 | grep -oE 'https://[^"]+\.png' | head -1)
    if [ -n "$url" ]; then curl -fsSL -o "$OUT/$id.png" "$url" && { echo "OK $id"; break; }; fi
    echo "retry $id ($try)"; sleep 3
  done
done
echo "DONE generating $(ls $OUT | wc -l) images"
