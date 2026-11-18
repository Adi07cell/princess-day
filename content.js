/* ==========================================================================
   EVERYTHING SHE READS LIVES HERE.
   Edit any line freely — the site rebuilds itself from this file.
   ========================================================================== */
const CONFIG = {
  name: 'Rishika',
  // Your WhatsApp number with country code, digits only (e.g. '919812345678').
  // Leave empty and WhatsApp will ask her who to send it to.
  whatsapp: '',
  signOff: 'your beta reader, on call',
  dateLine: '18 · XI · MMXXVI',
};

const PLUSHIES = [
  { id: 'bunny',   name: 'Count Fluffula',        kind: 'vampire bunny, felt fangs',  msg: 'Vampire, technically. Only bites chocolate. Broods like a Salvatore.' },
  { id: 'bat',     name: 'Batsy Begum',           kind: 'bat in a lace bonnet',        msg: 'Pipettes by day, plot twists by night. Sound familiar?' },
  { id: 'ghost',   name: 'Bhootu',                kind: 'ghost with a coffee',         msg: "Haunts Coffee House. Orders infusion. Judges people who don't." },
  { id: 'cat',     name: 'Ms. Mishti',            kind: 'cat in leather & pearls',     msg: 'Leather on the outside. Nolen gur on the inside.' },
  { id: 'owl',     name: 'Postmaster Pyacha',     kind: 'owl with a sealed letter',    msg: 'Owl Post, Kolkata branch. Still delivering your Hogwarts letter — it’s only a few years late.' },
  { id: 'spider',  name: 'Lacey',                 kind: 'spider with lace sleeves',    msg: 'Spins plot twists, not webs.' },
  { id: 'axolotl', name: 'Dr. Axo (PhD pending)', kind: 'axolotl in a lab coat',       msg: "Can regrow limbs. Cannot regrow the Kinder Joy you ate." },
];

const COUPONS = [
  { icon: 'egg',       title: 'One Kinder Joy',                 fine: 'The toy will be reviewed by me, in total seriousness.' },
  { icon: 'moon',      title: 'One bedtime story, voice-noted', fine: 'Any genre. Horror at your own risk. I do all the voices.' },
  { icon: 'note',      title: 'One playlist, made just for you', fine: 'One song for every mood you had this week. Gothic ones included.' },
  { icon: 'flask',     title: 'One unlimited lab-day rant',     fine: 'I listen. Advice only if you ask for it.' },
  { icon: 'quill',     title: 'Beta reader, on call',           fine: 'Your next chapter, read the same night, with an embarrassingly long comment.' },
  { icon: 'bat',       title: 'One TVD episode, your pick',     fine: "I'll defend whichever brother you don't." },
  { icon: 'candle',    title: 'One 2 a.m. horror-movie call',   fine: "I'll pretend I'm not scared. You'll pretend to believe me." },
  { icon: 'heart',     title: 'One plushie, your pick',         fine: "Goth, cute, or both. (It's always both.)" },
];

const CHARMS = [
  { icon: 'owl',  name: 'a tiny owl charm' },
  { icon: 'star', name: 'a tiny wand-star charm' },
  { icon: 'bat',  name: 'a tiny bat charm' },
];

const TAROT = [
  { n: 'I',    icon: 'sweet',  name: 'The Sweet Tooth', read: 'A craving approaches. Fate suggests chocolate.' },
  { n: 'II',   icon: 'quill',  name: 'The Quill',       read: 'The stuck chapter unlocks soon. Write it messy.' },
  { n: 'III',  icon: 'flask',  name: 'The Alchemist',   read: 'Big results are brewing in your lab. Be patient with the pipette.' },
  { n: 'IV',   icon: 'moon',   name: 'The Velvet Moon', read: 'Don’t invite anyone in tonight. Vampire rules — you know the ones.' },
  { n: 'V',    icon: 'cups',   name: 'Two Cups',        read: 'One for the lab, one for the 2 a.m. chapter. You’ve earned both.' },
  { n: 'VI',   icon: 'bat',    name: 'The Bat',         read: 'Late nights favour you. Use them to write — save the scary bits for after midnight.' },
  { n: 'VII',  icon: 'owl',    name: 'The Owl',         read: 'A message is on its way. Open it slowly.' },
  { n: 'VIII', icon: 'crown',  name: 'The Crown',       read: "You were never waiting to be crowned. Today's just the paperwork." },
];

const TALE = {
  start: {
    text: [
      'Kolkata, 11:58 p.m. College Street is asleep — a mile of shuttered bookstalls, and one streetlamp flickering like it knows a secret.',
      'One stall is still open. No owner. Just a candle, and a single book bound in black leather, tied with a pink ribbon.',
      'Your name is on the cover.',
    ],
    choices: [['Untie the ribbon', 'open'], ['Find whoever left it', 'follow']],
  },
  open: {
    text: [
      'The pages are blank — until ink blooms across the first one, as if someone is writing from the other side:',
      '“Happy Princess Day. Don’t be scared. (Okay, be a little scared. It’s more fun.)”',
      'Across the street, the lights of the Indian Coffee House flicker on. It closed hours ago.',
    ],
    choices: [['Go inside', 'coffee'], ['Write back in the book', 'write']],
  },
  follow: {
    text: [
      'The street is empty. Almost.',
      'Hanging from the awning is a bat — a very small, very fluffy bat, wearing a bow. It blinks at you.',
      'Then it flies, slowly, the way things fly when they want to be followed — straight toward the Indian Coffee House, where the lights are coming on, one by one.',
    ],
    choices: [['Follow the bat', 'coffee'], ['Go back for the book', 'open']],
  },
  write: {
    text: [
      'You write: Who are you?',
      'The ink drinks your words. A pause. Then, in a hurried hand:',
      '“Just someone who thinks you should be the one writing this. The coffee’s getting cold. Go.”',
    ],
    choices: [['Go to the Coffee House', 'coffee']],
  },
  coffee: {
    text: [
      'Inside, the old ceiling fans turn and the air smells of infusion and old paper. Every table is empty except one.',
      'On it: a coffee, still steaming. A plate of nolen gur sandesh. A Kinder Joy, sealed. And a note folded into a tiny crown:',
      '“Sorry I couldn’t be here in person. Consider this the trailer.”',
    ],
    choices: [['Sandesh first. Obviously.', 'end'], ['Open the Kinder Joy', 'kinder']],
  },
  kinder: {
    text: [
      'There’s no toy inside. Only a tiny scroll, rolled tight:',
      '“Kinder Joy before sandesh. Noted. (I already knew.)”',
      'You pocket it. For safekeeping. Obviously.',
    ],
    choices: [['Turn to the last page', 'end']],
  },
  end: {
    text: [
      'You open the leather book to its last page. One line, in that same hurried hand:',
      '“Chapter One ends here. The rest isn’t written yet — the good stories never are. But if the heroine ever wants a co-author…',
      'I know a guy. He’s terrible at horror. He’s very good at bringing coffee.”',
    ],
    end: true,
  },
};

const INGREDIENTS = [
  { id: 'kinder',  name: 'Kinder Joy, crushed',        icon: 'egg',      color: '#F4B6C8' },
  { id: 'coffee',  name: 'Infusion, black',            icon: 'infusion', color: '#6B3E26' },
  { id: 'moon',    name: 'Bottled moonlight',          icon: 'moon',     color: '#C8B6E2' },
  { id: 'vervain', name: 'Vervain (gloves on)',        icon: 'leaf',     color: '#7FA06B' },
  { id: 'gur',     name: 'Nolen gur, one spoon',       icon: 'drop',     color: '#C07A2C' },
  { id: 'ink',     name: 'Ink from a 2 a.m. chapter',  icon: 'quill',    color: '#3A2357' },
  { id: 'rose',    name: 'Black-red rose petals',      icon: 'rose',     color: '#B0173C' },
  { id: 'dna',     name: 'One double helix',           icon: 'helix',    color: '#8FD3EA' },
  { id: 'fluff',   name: 'Plushie fluff',              icon: 'cloud',    color: '#FFF4F8' },
];

const RECIPES = [
  { set: ['kinder', 'coffee', 'ink'],  name: 'Draught of the 2 A.M. Chapter', effect: 'Four uninterrupted hours of writing. Guaranteed.', side: 'You will name a villain after someone who annoyed you today.', hint: 'Something sweet, something strong, something to write with.' },
  { set: ['moon', 'vervain', 'rose'],  name: 'Mystic Falls Mist', effect: 'Every vampire within five miles politely waits to be invited in.', side: 'A sudden urge to rewatch season one.', hint: 'Night, the green herb vampires hate, and a flower the colour of trouble.' },
  { set: ['dna', 'coffee', 'ink'],     name: 'Thesis Tonic', effect: 'Turns failed experiments into “interesting preliminary results”.', side: 'Unshakeable confidence in front of your professor.', hint: 'Science, caffeine, and the ink you’ll sign your thesis with.' },
  { set: ['kinder', 'gur', 'fluff'],   name: 'Elixir of Maximum Sweetness', effect: 'Turns any bad day into a decent one within minutes.', side: 'You will want a plushie. (You always want a plushie.)', hint: 'Everything soft and sugary on the shelf.' },
  { set: ['moon', 'ink', 'dna'],       name: 'Felix Felicis, Homebrewed', effect: 'Liquid luck: every pipette lands, every plot twist works.', side: 'Mild smugness. Fully deserved.', hint: 'Moonlight, a double helix, and a story’s ink. A lucky combination.' },
  { set: ['rose', 'kinder', 'moon'],   name: 'Amortentia (Unlicensed)', effect: 'Smells like whatever you love most.', side: 'In this lab it smells suspiciously of Kinder Joy.', hint: 'Roses, moonlight, and your favourite egg.' },
  { set: ['vervain', 'coffee', 'dna'], name: 'Vervain Espresso', effect: 'Wakes the dead. Specifically you, at 8 a.m., before lab.', side: 'Vampires will find you slightly rude.', hint: 'Something green, something black, something twisted.' },
  { set: ['fluff', 'rose', 'ink'],     name: 'Ink of the Unwritten Romance', effect: 'Whatever you write next, a reader cries at chapter twelve.', side: 'You will pretend you didn’t plan it.', hint: 'Something soft, something red, something to write with.' },
  { set: ['gur', 'coffee', 'moon'],    name: 'Kolkata Winter Night', effect: 'Bottled fog, streetlights, and one very long adda.', side: 'Conversations that end at 2 a.m. and still feel too short.', hint: 'Jaggery, coffee, and the moon over College Street.' },
];

const DUDS = [
  'Smells like {a} and ambition. Lab notes say: “promising”.',
  'Glows faintly. Hums when you’re not looking. Probably fine.',
  'Tastes of {a}, mild regret, and a hint of {b}.',
  'Professor’s verdict: Exceeds Expectations. Barely.',
  'It turned the flask a colour that doesn’t have a name yet. You get to name it.',
];

const LETTER = [
  `A regular "happy princess day" text felt a little under-dressed, and I couldn't fit a Kinder Joy through WhatsApp. So I made you a small book instead. (Please don't ask how long it took.)`,
  `Somewhere between your horror plots, your plushie army and your very strong opinions on the Salvatore brothers, talking to you quietly became my favourite part of the day. You have never once been boring. I've checked. Thoroughly.`,
  `You're going to do big things — in the lab and on the page. I'm already practising "I knew her before she was famous."`,
  `But today, put the lab coat and the half-written chapter down for a bit. Today you're just the princess. Wear the crown a little crooked — it suits you.`,
  `Happy Princess Day, Your Highness.`,
]

// One real thing she once said to you — the proof you actually listen.
// Fill in the quote (keep it funny, not something vulnerable). Leave empty to hide it.
const MARGIN = { quote: '', note: '— R., around 1 a.m. Still undefeated.' };

const SECRETS = {
  bats: `You found all three. Of course you did — you notice everything.\nA secret for your trouble: I replayed that little waltz about forty times while building this. It's stuck in my head now. Funny how that keeps happening.`,
  vial: `Amortentia. They say it smells different to everyone.\nThis one smells like fresh coffee, nolen gur, and the pages of a new book.\nNo idea why.`,
  crown: `Long live the princess. (The crown is non-removable. I checked.)`,
};

const SONGS = {
  sweet:  [['From the Start', 'Laufey'], ['Ei Path Jodi Na Sesh Hoy', 'Hemanta & Sandhya Mukherjee']],
  gothic: [['Never Let Me Go', 'Florence + The Machine'], ['Ei Raat Tomar Amar', 'Hemanta Mukherjee']],
  dreamy: [['Enchanted', 'Taylor Swift'], ['Tumi Robe Nirobe', 'Rabindranath Tagore']],
  potions: [['Hedwig’s Theme', 'John Williams'], ['Double Trouble', 'John Williams']],
};

// Which score plays in which chapter while the music is on Auto.
const SCORE = { top: 'sweet', contents: 'sweet', crowning: 'sweet', vault: 'sweet', surprise: 'sweet',
                fortune: 'dreamy', tale: 'gothic', lab: 'potions', epilogue: 'sweet' };
