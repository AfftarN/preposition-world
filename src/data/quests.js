export const quests = [
  {
    id: 'quest-table-surface',
    prompt: 'Pip wants to place his lunch on the flat wooden table.',
    sentenceWithBlank: 'Pip placed his lunch _____ the table.',
    options: ['on-place', 'in-place', 'under'],
    correctId: 'on-place',
    failExplanations: {
      'in-place': 'Ouch! A table is a solid 2D flat surface (ON), not a hollow container (IN). Pip would need a saw to put it inside the wood!',
      'under': 'Pip put his lunch on the dusty floor underneath the table where the dog can eat it!'
    },
    zoneTarget: 'table',
    animationAction: 'hop_on_table'
  },
  {
    id: 'quest-box-interior',
    prompt: 'Pip wants to hide completely inside the toy box.',
    sentenceWithBlank: 'Pip is hiding _____ the box.',
    options: ['in-place', 'on-place', 'at-place'],
    correctId: 'in-place',
    failExplanations: {
      'on-place': 'Pip is sitting on the closed lid outside, completely visible to everyone!',
      'at-place': '"At the box" only marks the box as a point on a map, not Pip being enclosed inside.'
    },
    zoneTarget: 'box',
    animationAction: 'jump_in_box'
  },
  {
    id: 'quest-bus-stop',
    prompt: 'Pip is waiting at the designated coordinate on the street for the bus.',
    sentenceWithBlank: 'Pip is waiting for his friend _____ the bus stop.',
    options: ['at-place', 'in-place', 'on-place'],
    correctId: 'at-place',
    failExplanations: {
      'in-place': 'Unless Pip is literally trapped inside the glass timetable cabinet, a bus stop is a 0D coordinate point (AT)!',
      'on-place': 'Pip is precariously balancing on the roof of the bus shelter!'
    },
    zoneTarget: 'bus_stop',
    animationAction: 'stand_at_stop'
  },
  {
    id: 'quest-dive-into',
    prompt: 'Pip is outside the box and takes a flying dive to get inside.',
    sentenceWithBlank: 'Pip jumped _____ the box from the air.',
    options: ['into', 'in-place', 'onto'],
    correctId: 'into',
    failExplanations: {
      'in-place': '"In" describes static position. To express the dynamic trajectory crossing the boundary into the container, use INTO!',
      'onto': 'Pip landed on the edge of the lid instead of going inside the container!'
    },
    zoneTarget: 'box',
    animationAction: 'dive_into_box'
  },
  {
    id: 'quest-through-tunnel',
    prompt: 'Pip wants to pass from one side of the dark hill to the other through the stone tunnel.',
    sentenceWithBlank: 'Pip walked _____ the tunnel.',
    options: ['through', 'across', 'along'],
    correctId: 'through',
    failExplanations: {
      'across': '"Across" is for 2D flat surfaces (like a bridge or street). A tunnel is a 3D enclosed tube, so you move THROUGH it!',
      'along': '"Along" means walking parallel beside the tunnel, not passing inside its passage.'
    },
    zoneTarget: 'tunnel',
    animationAction: 'traverse_through_tunnel'
  },
  {
    id: 'quest-across-bridge',
    prompt: 'Pip needs to reach the other side of the river over the wooden bridge deck.',
    sentenceWithBlank: 'Pip walked _____ the bridge to the other bank.',
    options: ['across', 'through', 'into'],
    correctId: 'across',
    failExplanations: {
      'through': 'The bridge has an open deck, not enclosed tunnel walls. On open surfaces from side A to B, we travel ACROSS!',
      'into': 'Pip dove straight into the river water instead of crossing the bridge!'
    },
    zoneTarget: 'bridge',
    animationAction: 'cross_bridge'
  },
  {
    id: 'quest-jump-onto',
    prompt: 'Pip wants to leap from the floor up to the tabletop.',
    sentenceWithBlank: 'Pip leaped _____ the table.',
    options: ['onto', 'into', 'off'],
    correctId: 'onto',
    failExplanations: {
      'into': 'Wham! Pip tries to phase into the solid wooden tabletop like a ghost!',
      'off': '"Off" is jumping down from a surface, but Pip wants to land up on it.'
    },
    zoneTarget: 'table',
    animationAction: 'jump_onto_table'
  },
  {
    id: 'quest-fall-off',
    prompt: 'Pip lost his balance on the table edge and separated from the surface.',
    sentenceWithBlank: 'Pip fell _____ the table!',
    options: ['off', 'out-of', 'from'],
    correctId: 'off',
    failExplanations: {
      'out-of': 'Pip wasn\'t inside an enclosed box; he was on a surface platform, so he fell OFF!',
      'from': 'While "from" shows origin, "off" specifically denotes breaking contact with the supporting surface.'
    },
    zoneTarget: 'table',
    animationAction: 'hop_off_table'
  },
  {
    id: 'quest-time-year',
    prompt: 'Pip is setting his calendar for a full annual container.',
    sentenceWithBlank: 'Preposition World was launched _____ 2026.',
    options: ['in-time', 'on-time', 'at-time'],
    correctId: 'in-time',
    failExplanations: {
      'on-time': 'Years and centuries are large temporal containers at the base of the pyramid. Single days use ON, but years take IN!',
      'at-time': '"At" is reserved for needle-sharp moments like "at 5 PM" or "at noon", not broad years.'
    },
    zoneTarget: 'time_pyramid_base',
    animationAction: 'climb_pyramid_in'
  },
  {
    id: 'quest-time-day',
    prompt: 'Pip has a special celebration on a named calendar day.',
    sentenceWithBlank: 'Our next tournament starts _____ Friday.',
    options: ['on-time', 'in-time', 'at-time'],
    correctId: 'on-time',
    failExplanations: {
      'in-time': 'Days of the week are specific calendar page surfaces. Native speakers always say ON Friday, not IN Friday!',
      'at-time': '"At" is for clock hours, not full 24-hour day names.'
    },
    zoneTarget: 'time_pyramid_mid',
    animationAction: 'climb_pyramid_on'
  },
  {
    id: 'quest-time-hour',
    prompt: 'Pip set his alarm clock for the exact needle point on the dial.',
    sentenceWithBlank: 'Meet Pip at the fountain _____ 5:00 PM sharp.',
    options: ['at-time', 'in-time', 'on-time'],
    correctId: 'at-time',
    failExplanations: {
      'in-time': 'Clock hours are exact points at the sharp tip of the time pyramid. Always use AT for clock time!',
      'on-time': '"On" is for days and dates, not clock digits.'
    },
    zoneTarget: 'time_pyramid_top',
    animationAction: 'climb_pyramid_at'
  },
  {
    id: 'quest-good-at',
    prompt: 'Pip has been practicing the electric guitar and plays amazing solos.',
    sentenceWithBlank: 'Pip is very good _____ playing the guitar.',
    options: ['good-at', 'in-place', 'on-place'],
    correctId: 'good-at',
    failExplanations: {
      'in-place': 'Classic ESL trap! Russian speakers often think "хорош в", but in English you hit the target point of a skill: GOOD AT!',
      'on-place': '"Good on" is not used for personal skill proficiency.'
    },
    zoneTarget: 'stage_guitar',
    animationAction: 'play_guitar_stage'
  },
  {
    id: 'quest-interested-in',
    prompt: 'Pip loves looking through the telescope and reading astronomy books.',
    sentenceWithBlank: 'Pip is deeply interested _____ space exploration.',
    options: ['interested-in', 'good-at', 'on-place'],
    correctId: 'interested-in',
    failExplanations: {
      'good-at': '"Good at" measures skill, but here Pip has personal curiosity and immersion: INTERESTED IN!',
      'on-place': 'You immerse your mind INSIDE the subject, so it is strictly INTERESTED IN.'
    },
    zoneTarget: 'observatory_telescope',
    animationAction: 'look_through_telescope'
  },
  {
    id: 'quest-depend-on',
    prompt: 'The balance scale will only tip if weight is placed on its support arm.',
    sentenceWithBlank: 'The outcome will depend _____ your choices.',
    options: ['depend-on', 'into', 'in-place'],
    correctId: 'depend-on',
    failExplanations: {
      'into': 'Dependency is physical weight resting on a supporting platform (ON), not entering inside!',
      'in-place': 'Never say "depend in" or "depend from" — in English we always DEPEND ON.'
    },
    zoneTarget: 'balance_scales',
    animationAction: 'tilt_balance_lever'
  },
  {
    id: 'quest-listen-to',
    prompt: 'Pip put on his giant headphones to hear his favorite song.',
    sentenceWithBlank: 'Pip loves to listen _____ jazz music on the bench.',
    options: ['listen-to', 'towards', 'at-place'],
    correctId: 'listen-to',
    failExplanations: {
      'towards': 'While your attention moves in that direction, the fixed verb collocation is strictly LISTEN TO.',
      'at-place': 'You look at something with eyes, but you LISTEN TO with ears!'
    },
    zoneTarget: 'bench',
    animationAction: 'put_on_headphones'
  },
  {
    id: 'quest-congratulate-on',
    prompt: 'Pip won the 3D challenge trophy! Let us offer him our warmest praise.',
    sentenceWithBlank: 'We all congratulated Pip _____ winning first prize.',
    options: ['congratulate-on', 'good-at', 'in-place'],
    correctId: 'congratulate-on',
    failExplanations: {
      'in-place': 'Big Russian calque warning! Do not translate "поздравляю с" as "with" or "in" — native English rests congratulations ON the victory!',
      'good-at': '"Good at" is an adjective phrase, not the preposition following the verb congratulate.'
    },
    zoneTarget: 'stage_guitar',
    animationAction: 'clap_hands'
  }
];
