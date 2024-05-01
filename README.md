# Ultimate guitar to ChordPro converter

Static website that converts chords between different formats.

Supported formats:

| Format          | Input | Output |
| --------------- | ----- | ------ |
| ChordPro        | ✅    | ✅     |
| Ultimate Guitar | ✅    | ✅     |
| Latex           | ❌    | ✅     |

![Screenshot](./docs/screenshot.png)

## Details

Uses [ChordSheetJS](https://github.com/martijnversluis/ChordSheetJS) to parse and format the chords and lyrics.

A basic Latex formatter is provided in this repo, [MR pending](https://github.com/martijnversluis/ChordSheetJS/pull/107).

## Docker image
A docker image is available [here](https://hub.docker.com/repository/docker/squab007/ultimate/general)

It was generated using `docker build . -t squab007/ultimate-to-tex --push --platform linux/arm64`
