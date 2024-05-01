import Tag, {
  ARTIST,
  TITLE,
  SUBTITLE,
  COMMENT,
  CAPO,
  START_OF_CHORUS,
  END_OF_CHORUS,
  START_OF_VERSE,
  END_OF_VERSE
} from 'chordsheetjs/lib/chord_sheet/tag'
import ChordLyricsPair from 'chordsheetjs/lib/chord_sheet/chord_lyrics_pair'

const NEW_LINE = '\\\\\n'
const flatMap = (arr, fn) => arr.reduce((acc, x) => [...acc, ...fn(x)], [])

/**
 * Formats a song into a .tex file for the Latex songs package.
 * http://songs.sourceforge.net/docs.html
 */
class LatexFormatter {
  isHeaderTag (item) {
    return (
      item instanceof Tag && [TITLE, SUBTITLE, ARTIST].indexOf(item.name) !== -1
    )
  }

  /**
   * Formats a song into .tex file.
   * @param {Song} song The song to be formatted
   * @returns {string} The .tex file contents as string
   */
  format (song) {
    return [
      this.getHeader(song),
      this.formatOther(song),
      '\\endsong'
    ].join('\n')
  }

  getHeader (song) {
    return `\\songcolumns{1} % auf wie viele Spalten ist das Lied aufgeteilt. Standard: 1

\\beginsong{Liedname} % Name des Liedes
  [by={-}, % Autor des Liedes 
  LSVE={???}, % Liederbuchnummer im alten Swapingo Liederbuch
  LCopacaBeLa={???}, % Seitennuummer im CopacaBeLa Liederbuch
  LIsarBeLa={???}, % Liederbuchnummer im IsarBeLa Liederbuch
  LLiederbock={???}, % Seitennummer im Liederbock
  LDoppelbock={???}] % Seitennummer im Doppelbock


\\capo{1} % Capo Nummer

\\gtab{A}{X02220:001230}\ \ \ \ \

\\gtab{Am}{X02210:002310}\ \ \ \ \

\\gtab{A7}{X02020:001020}\ \ \ \ \

\\gtab{C}{X32010:032010}\ \ \ \ \

\\gtab{Cmaj7}{X32000:032000}\ \ \ \ \

\\gtab{D}{XX0232:000132}\ \ \ \ \

\\gtab{Dm}{XX0231:000231}\ \ \ \ \

\\gtab{Dm7}{XX02(11):000200}\ \ \ \ \

\\gtab{D7}{XX0232:000132}\ \ \ \ \

\\gtab{D/F#}{(254232):043020}\ \ \ \ \

\\gtab{E}{022100:023100}\ \ \ \ \

\\gtab{Em}{022000:012000}\ \ \ \ \

\\gtab{Em7}{020000:010000}\ \ \ \ \

\\gtab{E7}{020100:020100}\ \ \ \ \

\\gtab{F}{(133211):034200}\ \ \ \ \

\\gtab{G}{320003:210003}\ \ \ \ \

\\gtab{Gsus4}{330013:230014}\ \ \ \ \

\\gtab{Hm}{2:X(24432):003420}\ \ \ \ \

\\gtab{H7}{X21202:021304}\ \ \ \ \


    `;
  }

  formatOther (song) {
    let verseOpened = false;
    let chorusOpened = false;
    const tags = ['\\textcomment', '\\capo', '\\beginchorus', '\\endchorus', '\\beginverse', '\\endverse'];
    return song.lines.map((line) => this.formatLine(line)).reduce((accumulator, current, index, array) => {
      const lastElem = index > 0 ? array[index - 1] : '';
      if (current.includes('\\beginverse') && !verseOpened && !chorusOpened) {
        verseOpened = true
      } else if (current.includes('\\beginchorus') && !chorusOpened) {
        chorusOpened = true;
      } else if (current.includes('\\beginverse') && verseOpened) {
        return accumulator + '\\endverse\n' + current;
      } else if (current.includes('\\beginverse') && chorusOpened) {
        chorusOpened = false;
        verseOpened = true;
        return accumulator + '\\endchorus\n' + current;
      } else if (current.includes('\\endverse')) {
        verseOpened = false;
      } else if (current.includes('\\endchorus')) {
        chorusOpened = false;
      }
      if (tags.some(tag => lastElem.includes(tag) || lastElem === '')) {
        return accumulator + '\n' + current;
      } else {
        return accumulator + NEW_LINE + current;
      }
    })
  }

  formatLine (line) {
    return line.items.map((item) => this.formatItem(item)).join('')
  }

  formatItem (item) {
    if (this.isHeaderTag(item)) {
      return ''
    } else if (item instanceof Tag) {
      return this.formatTag(item)
    } else if (item instanceof ChordLyricsPair) {
      return this.formatChordLyricsPair(item)
    }

    return ''
  }

  formatTag (tag) {
    switch (tag.name) {
      case COMMENT:
        return tag.value?.includes('horus') ? '\\beginchorus' : '\\beginverse'
      case CAPO:
        return `\\capo{${tag.value}}`
      case START_OF_CHORUS:
        return '\\beginchorus'
      case END_OF_CHORUS:
        return '\\endchorus'
      case START_OF_VERSE:
        return '\\beginverse'
      case END_OF_VERSE:
        return '\\endverse'
      default:
        return tag.hasValue()
          ? `\\textcomment{${tag.originalName}: ${tag.value}}`
          : `\\textcomment{${tag.originalName}}`
    }
  }

  formatChordLyricsPair (chordLyricsPair) {
    return [
      this.formatChordLyricsPairChords(chordLyricsPair),
      this.formatChordLyricsPairLyrics(chordLyricsPair)
    ].join('')
  }

  formatChordLyricsPairChords (chordLyricsPair) {
    if (chordLyricsPair.chords) {
      return `\\[${chordLyricsPair.chords}]`
    }

    return ''
  }

  formatChordLyricsPairLyrics (chordLyricsPair) {
    return chordLyricsPair.lyrics || ''
  }
}

export default LatexFormatter
