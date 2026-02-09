# Team Photos Directory

This directory contains profile photos for the expert team members displayed on the About page.

## Required Images

Place the following images in this directory with the exact filenames:

1. `venessa-garcia.jpg` - Dr. Venessa Garcia
2. `gladdy-christie-compasan.jpg` - Engr. Gladdy Christie Compasan
3. `flora-monica-mabaylan.jpg` - Ms. Flora Monica Mabaylan
4. `rhea-suzette-haguisan.jpg` - Ms. Rhea Suzette Haguisan
5. `jodie-rey-fernandez.jpg` - Engr. Jodie Rey Fernandez
6. `clark-darwin-gozon.jpg` - Engr. Clark Darwin Gozon
7. `mark-lister-nalupa.jpg` - Engr. Mark Lister Nalupa
8. `noreza-aleno.jpg` - Noreza P. Aleno
9. `krystia-ces-napili.jpg` - Krystia Ces G. Napili
10. `michael-cerbito.jpg` - Michael J. Cerbito

## Image Specifications

- **Format**: JPEG (.jpg) recommended
- **Dimensions**: 400x400 pixels (square)
- **File size**: Under 100KB for optimal loading
- **Quality**: High enough for clear display but compressed for web

## Implementation Details

The images are displayed using the Avatar component from ShadCN UI, which provides:
- Responsive sizing
- Fallback to initials if image fails to load
- Circular cropping
- Smooth loading transitions

The fallback shows the person's initials (first letter of each name) with the USTP gradient background when images are not available.