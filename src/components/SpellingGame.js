import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, RotateCcw, Trophy, BookOpen, Zap } from 'lucide-react';

const SpellingGame = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [syllables, setSyllables] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [category, setCategory] = useState('general');
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [wordHistory, setWordHistory] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentHint, setCurrentHint] = useState('');
  const [gameStats, setGameStats] = useState({
    totalWords: 0,
    correctWords: 0,
    accuracy: 0
  });

  const inputRef = useRef(null);
  const synthRef = useRef(null);

  // Comprehensive word database
  const wordDatabase = {
    easy: {
      generalVocabulary: [
        // 75 words
        { word: 'cat', syllables: 'cat', hint: 'A small furry pet that purrs', definition: 'A small domesticated carnivorous mammal with soft fur.' },
        { word: 'dog', syllables: 'dog', hint: 'A loyal four-legged friend', definition: 'A domesticated carnivorous mammal that typically has a long snout.' },
        { word: 'house', syllables: 'house', hint: 'A place where people live', definition: 'A building for human habitation, especially one that is lived in by a family.' },
        { word: 'water', syllables: 'wa-ter', hint: 'Clear liquid we drink', definition: 'A colorless, transparent, odorless liquid that forms the seas, lakes, rivers, and rain.' },
        { word: 'happy', syllables: 'hap-py', hint: 'Feeling joy and pleasure', definition: 'Feeling or showing pleasure or contentment.' },
        { word: 'green', syllables: 'green', hint: 'The color of grass', definition: 'The color between blue and yellow in the spectrum; the color of growing grass.' },
        { word: 'smile', syllables: 'smile', hint: 'What you do when you\'re happy', definition: 'A pleased, kind, or amused facial expression, typically with the corners of the mouth turned up.' },
        { word: 'book', syllables: 'book', hint: 'Something you read', definition: 'A written or printed work consisting of pages glued or sewn together along one side.' },
        { word: 'chair', syllables: 'chair', hint: 'Something you sit on', definition: 'A separate seat for one person, typically with a back and four legs.' },
        { word: 'light', syllables: 'light', hint: 'Opposite of dark', definition: 'The natural agent that stimulates sight and makes things visible.' },
        { word: 'friend', syllables: 'friend', hint: 'A person you like and trust', definition: 'A person whom one knows and with whom one has a bond of mutual affection.' },
        { word: 'school', syllables: 'school', hint: 'A place for learning', definition: 'An institution for educating children.' },
        { word: 'play', syllables: 'play', hint: 'To engage in activity for fun', definition: 'Engage in activity for enjoyment and recreation rather than a serious or practical purpose.' },
        { word: 'food', syllables: 'food', hint: 'What we eat to live', definition: 'Any nutritious substance that people or animals eat or drink to maintain life and growth.' },
        { word: 'ball', syllables: 'ball', hint: 'A round object used in games', definition: 'A solid or hollow spherical or ovoid object that is kicked, thrown, or hit in a game.' },
        { word: 'hand', syllables: 'hand', hint: 'The end part of a person\'s arm', definition: 'The end part of a person\'s arm beyond the wrist, including the palm, fingers, and thumb.' },
        { word: 'walk', syllables: 'walk', hint: 'To move at a regular pace', definition: 'Move at a regular and fairly slow pace by lifting and setting down each foot in turn.' },
        { word: 'talk', syllables: 'talk', hint: 'To speak in order to give information', definition: 'Speak in order to give information or express ideas or feelings; converse or communicate.' },
        { word: 'music', syllables: 'mu-sic', hint: 'Sounds that are sung or played', definition: 'Vocal or instrumental sounds combined to produce beauty of form, harmony, and emotion.' },
        { word: 'color', syllables: 'col-or', hint: 'The property of light reflection', definition: 'The property possessed by an object of producing different sensations on the eye as a result of the way it reflects or emits light.' },
        { word: 'sleep', syllables: 'sleep', hint: 'To rest your mind and body', definition: 'A condition of body and mind that typically recurs for several hours every night, in which the nervous system is inactive.' },
        { word: 'jump', syllables: 'jump', hint: 'To push yourself into the air', definition: 'Push oneself off a surface and into the air by using the muscles in one\'s legs and feet.' },
        { word: 'kind', syllables: 'kind', hint: 'Being friendly and generous', definition: 'Having or showing a friendly, generous, and considerate nature.' },
        { word: 'love', syllables: 'love', hint: 'A very strong feeling of affection', definition: 'An intense feeling of deep affection.' },
        { word: 'open', syllables: 'o-pen', hint: 'Not closed or blocked up', definition: 'Allowing access, passage, or a view through an empty space; not closed or blocked up.' },
        { word: 'close', syllables: 'close', hint: 'To move something to cover an opening', definition: 'Move so as to cover an opening.' },
        { word: 'start', syllables: 'start', hint: 'To begin doing something', definition: 'Begin or be reckoned from a particular point in time or space.' },
        { word: 'stop', syllables: 'stop', hint: 'To finish moving or doing something', definition: 'Come to an end; cease to happen.' },
        { word: 'help', syllables: 'help', hint: 'To make it easier for someone', definition: 'Make it easier for (someone) to do something by offering one\'s services or resources.' },
        { word: 'work', syllables: 'work', hint: 'Activity involving mental or physical effort', definition: 'Activity involving mental or physical effort done in order to achieve a purpose or result.' },
        { word: 'family', syllables: 'fam-i-ly', hint: 'A group of parents and children', definition: 'A group consisting of parents and children living together in a household.' },
        { word: 'father', syllables: 'fa-ther', hint: 'A male parent', definition: 'A man in relation to his natural child or children.' },
        { word: 'mother', syllables: 'moth-er', hint: 'A female parent', definition: 'A woman in relation to her natural child or children.' },
        { word: 'baby', syllables: 'ba-by', hint: 'A very young child', definition: 'A very young child, especially one newly born or in infancy.' },
        { word: 'child', syllables: 'child', hint: 'A young human being', definition: 'A young human being below the age of puberty or below the legal age of majority.' },
        { word: 'road', syllables: 'road', hint: 'A wide way between places', definition: 'A wide way leading from one place to another, especially one with a prepared surface.' },
        { word: 'car', syllables: 'car', hint: 'A vehicle with four wheels', definition: 'A road vehicle, typically with four wheels, powered by an internal combustion engine or electric motor.' },
        { word: 'city', syllables: 'ci-ty', hint: 'A large town', definition: 'A large and important town.' },
        { word: 'name', syllables: 'name', hint: 'A word by which a person or thing is known', definition: 'A word or set of words by which a person, animal, place, or thing is known, addressed, or referred to.' },
        { word: 'game', syllables: 'game', hint: 'An activity for amusement', definition: 'A form of play or sport, especially a competitive one played according to rules.' },
        { word: 'time', syllables: 'time', hint: 'The progress of existence', definition: 'The indefinite continued progress of existence and events in the past, present, and future.' },
        { word: 'year', syllables: 'year', hint: 'A period of 365 days', definition: 'The period of 365 days, or 366 in leap years, starting from the first of January.' },
        { word: 'day', syllables: 'day', hint: 'A period of 24 hours', definition: 'A period of twenty-four hours as a unit of time, reckoned from one midnight to the next.' },
        { word: 'night', syllables: 'night', hint: 'The period from sunset to sunrise', definition: 'The period of darkness in each twenty-four hours; the time from sunset to sunrise.' },
        { word: 'money', syllables: 'mon-ey', hint: 'What you use to buy things', definition: 'A current medium of exchange in the form of coins and banknotes.' },
        { word: 'story', syllables: 'sto-ry', hint: 'An account of people and events', definition: 'An account of imaginary or real people and events told for entertainment.' },
        { word: 'world', syllables: 'world', hint: 'The earth, with all its countries', definition: 'The earth, together with all of its countries, peoples, and natural features.' },
        { word: 'idea', syllables: 'i-de-a', hint: 'A thought or suggestion', definition: 'A thought or suggestion as to a possible course of action.' },
        { word: 'sound', syllables: 'sound', hint: 'Vibrations that you can hear', definition: 'Vibrations that travel through the air and can be heard when they reach an ear.' },
        { word: 'place', syllables: 'place', hint: 'A particular position or point', definition: 'A particular position, point, or area in space; a location.' },
        { word: 'paper', syllables: 'pa-per', hint: 'Material to write on', definition: 'Material manufactured in thin sheets from the pulp of wood or other fibrous substances.' },
        { word: 'group', syllables: 'group', hint: 'A number of people or things', definition: 'A number of people or things that are located, gathered, or classed together.' },
        { word: 'party', syllables: 'par-ty', hint: 'A social gathering of people', definition: 'A social gathering of invited guests, typically involving eating, drinking, and entertainment.' },
        { word: 'white', syllables: 'white', hint: 'The color of milk or snow', definition: 'Of the color of milk or fresh snow, due to the reflection of all visible rays of light.' },
        { word: 'black', syllables: 'black', hint: 'The darkest color', definition: 'Of the very darkest color owing to the absence of or complete absorption of light.' },
        { word: 'red', syllables: 'red', hint: 'The color of blood', definition: 'Of a color at the end of the spectrum next to orange and opposite violet, as of blood or fire.' },
        { word: 'blue', syllables: 'blue', hint: 'The color of the clear sky', definition: 'Of a color intermediate between green and violet, as of the sky or sea on a sunny day.' },
        { word: 'yellow', syllables: 'yel-low', hint: 'The color of lemons or the sun', definition: 'Of the color between green and orange in the spectrum, as of ripe lemons or egg yolks.' },
        { word: 'big', syllables: 'big', hint: 'Of considerable size', definition: 'Of considerable size, extent, or intensity.' },
        { word: 'small', syllables: 'small', hint: 'Of a size that is less than normal', definition: 'Of a size that is less than normal or usual.' },
        { word: 'long', syllables: 'long', hint: 'Measuring a great distance', definition: 'Measuring a great distance from end to end.' },
        { word: 'short', syllables: 'short', hint: 'Measuring a small distance', definition: 'Measuring a small distance from end to end.' },
        { word: 'new', syllables: 'new', hint: 'Discovered recently', definition: 'Produced, introduced, or discovered recently or now for the first time; not existing before.' },
        { word: 'old', syllables: 'old', hint: 'Having lived for a long time', definition: 'Having lived for a long time; no longer young.' },
        { word: 'good', syllables: 'good', hint: 'To be desired or approved of', definition: 'To be desired or approved of.' },
        { word: 'bad', syllables: 'bad', hint: 'Of poor quality', definition: 'Of poor quality or a low standard.' },
        { word: 'hot', syllables: 'hot', hint: 'Having a high degree of heat', definition: 'Having a high degree of heat or a high temperature.' },
        { word: 'cold', syllables: 'cold', hint: 'Having a low degree of heat', definition: 'Of or at a low or relatively low temperature, especially when compared with the human body.' },
        { word: 'fast', syllables: 'fast', hint: 'Moving at high speed', definition: 'Moving or capable of moving at high speed.' },
        { word: 'slow', syllables: 'slow', hint: 'Moving at a low speed', definition: 'Moving or operating at a low speed; not quick or fast.' },
        { word: 'loud', syllables: 'loud', hint: 'Producing much noise', definition: 'Producing or capable of producing much noise; easily audible.' },
        { word: 'quiet', syllables: 'qui-et', hint: 'Making little or no noise', definition: 'Making little or no noise.' },
        { word: 'hard', syllables: 'hard', hint: 'Solid, firm, and rigid', definition: 'Solid, firm, and rigid; not easily broken, bent, or pierced.' },
        { word: 'soft', syllables: 'soft', hint: 'Easy to mold, cut, or fold', definition: 'Easy to mold, cut, compress, or fold; not hard or firm to the touch.' }
      ],
      scienceAndTechnology: [
          // 75 words
          { word: 'sun', syllables: 'sun', hint: 'The star at the center of our solar system', definition: 'The star around which the earth orbits.' },
          { word: 'moon', syllables: 'moon', hint: 'Earth\'s natural satellite', definition: 'The natural satellite of the earth, visible by reflected light from the sun.' },
          { word: 'star', syllables: 'star', hint: 'A twinkling light in the night sky', definition: 'A fixed luminous point in the night sky that is a large, remote incandescent body.' },
          { word: 'rock', syllables: 'rock', hint: 'Hard mineral matter', definition: 'The solid mineral material forming part of the surface of the earth.' },
          { word: 'wind', syllables: 'wind', hint: 'Moving air', definition: 'The perceptible natural movement of the air.' },
          { word: 'rain', syllables: 'rain', hint: 'Water falling from clouds', definition: 'Moisture condensed from the atmosphere that falls visibly in separate drops.' },
          { word: 'snow', syllables: 'snow', hint: 'White frozen precipitation', definition: 'Atmospheric water vapor frozen into ice crystals and falling in light white flakes.' },
          { word: 'fire', syllables: 'fire', hint: 'Hot burning flame', definition: 'Combustion or burning, in which substances combine chemically with oxygen.' },
          { word: 'earth', syllables: 'earth', hint: 'The planet we live on', definition: 'The planet on which we live; the world.' },
          { word: 'sky', syllables: 'sky', hint: 'The space above the Earth', definition: 'The region of the atmosphere and outer space seen from the earth.' },
          { word: 'cloud', syllables: 'cloud', hint: 'A white or gray mass in the sky', definition: 'A visible mass of water droplets or ice crystals suspended in the atmosphere.' },
          { word: 'heat', syllables: 'heat', hint: 'The quality of being hot', definition: 'The quality of being hot; high temperature.' },
          { word: 'ice', syllables: 'ice', hint: 'Frozen water', definition: 'Water frozen into a solid state.' },
          { word: 'air', syllables: 'air', hint: 'The invisible gas surrounding the Earth', definition: 'The invisible gaseous substance surrounding the earth, a mixture mainly of oxygen and nitrogen.' },
          { word: 'gas', syllables: 'gas', hint: 'A substance like air that fills space', definition: 'An airlike fluid substance which expands freely to fill any space available.' },
          { word: 'atom', syllables: 'at-om', hint: 'The smallest particle of an element', definition: 'The basic unit of a chemical element.' },
          { word: 'cell', syllables: 'cell', hint: 'The smallest unit of a living thing', definition: 'The smallest structural and functional unit of an organism.' },
          { word: 'gene', syllables: 'gene', hint: 'A unit of heredity', definition: 'A unit of heredity which is transferred from a parent to offspring.' },
          { word: 'mass', syllables: 'mass', hint: 'The amount of matter in an object', definition: 'The quantity of matter which a body contains.' },
          { word: 'wave', syllables: 'wave', hint: 'A disturbance on the surface of water', definition: 'A disturbance on the surface of a liquid body, as the sea or a lake.' },
          { word: 'light', syllables: 'light', hint: 'Energy that lets us see', definition: 'The natural agent that stimulates sight and makes things visible.' },
          { word: 'sound', syllables: 'sound', hint: 'What we hear', definition: 'Vibrations that travel through the air or another medium and can be heard.' },
          { word: 'force', syllables: 'force', hint: 'A push or a pull', definition: 'Strength or energy as an attribute of physical action or movement.' },
          { word: 'speed', syllables: 'speed', hint: 'How fast something moves', definition: 'The rate at which someone or something is able to move or operate.' },
          { word: 'power', syllables: 'pow-er', hint: 'The ability to do something', definition: 'The ability or capacity to do something or act in a particular way.' },
          { word: 'energy', syllables: 'en-er-gy', hint: 'The strength to do work', definition: 'The strength and vitality required for sustained physical or mental activity.' },
          { word: 'plant', syllables: 'plant', hint: 'A living thing that grows in the ground', definition: 'A living organism of the kind exemplified by trees, shrubs, herbs, and grasses.' },
          { word: 'animal', syllables: 'an-i-mal', hint: 'A living creature that is not a human', definition: 'A living organism that feeds on organic matter.' },
          { word: 'human', syllables: 'hu-man', hint: 'A person', definition: 'Relating to or characteristic of people or human beings.' },
          { word: 'brain', syllables: 'brain', hint: 'The organ inside the head that controls thought', definition: 'An organ of soft nervous tissue functioning as the coordinating center of sensation.' },
          { word: 'heart', syllables: 'heart', hint: 'The organ that pumps blood', definition: 'A hollow muscular organ that pumps the blood through the circulatory system.' },
          { word: 'bone', syllables: 'bone', hint: 'The hard tissue that forms the skeleton', definition: 'Any of the pieces of hard, whitish tissue making up the skeleton in humans.' },
          { word: 'skin', syllables: 'skin', hint: 'The outer layer of the body', definition: 'The thin layer of tissue forming the natural outer covering of the body.' },
          { word: 'blood', syllables: 'blood', hint: 'The red liquid in the body', definition: 'The red liquid that circulates in the arteries and veins of humans.' },
          { word: 'metal', syllables: 'met-al', hint: 'A solid material that is typically hard and shiny', definition: 'A solid material that is typically hard, shiny, malleable, and fusible with good conductivity.' },
          { word: 'gold', syllables: 'gold', hint: 'A yellow precious metal', definition: 'A yellow precious metal, the chemical element of atomic number 79.' },
          { word: 'iron', syllables: 'i-ron', hint: 'A strong, hard magnetic silvery-gray metal', definition: 'A strong, hard magnetic silvery-gray metal, the chemical element of atomic number 26.' },
          { word: 'copper', syllables: 'cop-per', hint: 'A red-brown metal', definition: 'A red-brown metal, the chemical element of atomic number 29.' },
          { word: 'silver', syllables: 'sil-ver', hint: 'A precious shiny grayish-white metal', definition: 'A precious shiny grayish-white metal, the chemical element of atomic number 47.' },
          { word: 'glass', syllables: 'glass', hint: 'A hard, brittle, transparent substance', definition: 'A hard, brittle substance, typically transparent, made by fusing sand with soda and lime.' },
          { word: 'wood', syllables: 'wood', hint: 'The hard material of a tree', definition: 'The hard fibrous material that forms the main substance of the trunk of a tree.' },
          { word: 'stone', syllables: 'stone', hint: 'Hard solid non-metallic mineral matter', definition: 'Hard solid non-metallic mineral matter of which rock is made.' },
          { word: 'sand', syllables: 'sand', hint: 'A loose granular substance on beaches', definition: 'A loose granular substance, resulting from the erosion of siliceous and other rocks.' },
          { word: 'soil', syllables: 'soil', hint: 'The upper layer of earth for plants', definition: 'The upper layer of earth in which plants grow.' },
          { word: 'mud', syllables: 'mud', hint: 'Soft, sticky mixture of earth and water', definition: 'Soft, sticky matter resulting from the mixing of earth and water.' },
          { word: 'dust', syllables: 'dust', hint: 'Fine, dry powder of earth', definition: 'Fine, dry powder consisting of tiny particles of earth or waste matter.' },
          { word: 'smoke', syllables: 'smoke', hint: 'Visible suspension of particles from burning', definition: 'A visible suspension of carbon or other particles in air, from a burning substance.' },
          { word: 'steam', syllables: 'steam', hint: 'The vapor of heated water', definition: 'The vapor into which water is converted when it is heated.' },
          { word: 'vapor', syllables: 'va-por', hint: 'A substance suspended in the air', definition: 'A substance diffused or suspended in the air, especially one normally liquid or solid.' },
          { word: 'liquid', syllables: 'liq-uid', hint: 'A substance that flows freely', definition: 'A substance that flows freely but is of constant volume, like water or oil.' },
          { word: 'solid', syllables: 'sol-id', hint: 'Firm and stable in shape', definition: 'Firm and stable in shape; not liquid or fluid.' },
          { word: 'weight', syllables: 'weight', hint: 'A body\'s relative mass or heaviness', definition: 'A body\'s relative mass or the quantity of matter contained by it.' },
          { word: 'meter', syllables: 'me-ter', hint: 'A unit of length', definition: 'The fundamental unit of length in the metric system.' },
          { word: 'gram', syllables: 'gram', hint: 'A unit of mass', definition: 'A metric unit of mass, equal to one thousandth of a kilogram.' },
          { word: 'liter', syllables: 'li-ter', hint: 'A unit of volume', definition: 'A metric unit of capacity, formerly defined as the volume of one kilogram of water.' },
          { word: 'code', syllables: 'code', hint: 'Instructions for a computer', definition: 'A set of instructions in a programming language for a computer.'},
          { word: 'link', syllables: 'link', hint: 'A connection between two things', definition: 'A relationship between two things or situations, especially where one affects the other.'},
          { word: 'data', syllables: 'da-ta', hint: 'Facts and statistics', definition: 'Facts and statistics collected together for reference or analysis.' },
          { word: 'fact', syllables: 'fact', hint: 'A thing that is known to be true', definition: 'A thing that is known or proved to be true.' },
          { word: 'proof', syllables: 'proof', hint: 'Evidence that something is true', definition: 'Evidence or argument establishing a fact or the truth of a statement.' },
          { word: 'test', syllables: 'test', hint: 'A procedure to discover something', definition: 'A procedure intended to establish the quality, performance, or reliability of something.' },
          { word: 'lab', syllables: 'lab', hint: 'A place for scientific experiments', definition: 'A laboratory; a room or building equipped for scientific experiments or research.' },
          { word: 'study', syllables: 'stud-y', hint: 'Devoting time to acquire knowledge', definition: 'The devotion of time and attention to acquiring knowledge on an academic subject.' },
          { word: 'observe', syllables: 'ob-serve', hint: 'To watch something carefully', definition: 'Notice or perceive (something) and register it as being significant.' },
          { word: 'record', syllables: 're-cord', hint: 'To set down in permanent form', definition: 'Set down in writing or some other permanent form for later reference.' },
          { word: 'theory', syllables: 'the-o-ry', hint: 'A system of ideas to explain something', definition: 'A system of ideas intended to explain something, based on general principles.' },
          { word: 'law', syllables: 'law', hint: 'A statement of fact from observation', definition: 'A statement of fact, deduced from observation, that a natural phenomenon always occurs if certain conditions are present.' },
          { word: 'model', syllables: 'mod-el', hint: 'A representation of something', definition: 'A three-dimensional representation of a person or thing, typically on a smaller scale.' },
          { word: 'chart', syllables: 'chart', hint: 'Information as a table or graph', definition: 'A sheet of information in the form of a table, graph, or diagram.' },
          { word: 'fuel', syllables: 'fu-el', hint: 'Material burned for energy', definition: 'Material such as coal, gas, or oil that is burned to produce heat or power.'},
          { word: 'lens', syllables: 'lens', hint: 'Curved glass used in glasses or cameras', definition: 'A piece of glass or other transparent substance with curved sides for concentrating or dispersing light rays.'},
          { word: 'orbit', syllables: 'or-bit', hint: 'The path of a planet or satellite', definition: 'The curved path of a celestial object or spacecraft around a star, planet, or moon.'},
          { word: 'phase', syllables: 'phase', hint: 'A stage in a process of change', definition: 'A distinct period or stage in a series of events or a process of change or development.'},
          { word: 'pulse', syllables: 'pulse', hint: 'A rhythmical throbbing of the arteries', definition: 'A rhythmical throbbing of the arteries as blood is propelled through them, typically felt in the wrists or neck.'},
          { word: 'scale', syllables: 'scale', hint: 'A device for weighing', definition: 'An instrument for weighing. Scales were originally simple balances but are now usually machines of various kinds.'}
      ],
      literatureAndArts: [
        // 75 words
        { word: 'word', syllables: 'word', hint: 'A single element of speech', definition: 'A single distinct meaningful element of speech or writing.' },
        { word: 'read', syllables: 'read', hint: 'To comprehend written matter', definition: 'Look at and comprehend the meaning of (written or printed matter).' },
        { word: 'write', syllables: 'write', hint: 'To mark letters on a surface', definition: 'Mark (letters, words, or other symbols) on a surface, typically paper.' },
        { word: 'story', syllables: 'sto-ry', hint: 'An account of people and events', definition: 'An account of imaginary or real people and events told for entertainment.' },
        { word: 'book', syllables: 'book', hint: 'A written work of pages', definition: 'A written or printed work consisting of pages glued or sewn together along one side.' },
        { word: 'page', syllables: 'page', hint: 'One side of a sheet in a book', definition: 'One side of a sheet of paper in a book, magazine, or newspaper.' },
        { word: 'pen', syllables: 'pen', hint: 'An instrument for writing with ink', definition: 'An instrument for writing or drawing with ink.' },
        { word: 'poem', syllables: 'po-em', hint: 'Writing with rhythm and rhyme', definition: 'A piece of writing that partakes of the nature of both speech and song.' },
        { word: 'song', syllables: 'song', hint: 'Words set to music', definition: 'A short poem or other set of words set to music or meant to be sung.' },
        { word: 'rhyme', syllables: 'rhyme', hint: 'Words with similar ending sounds', definition: 'Correspondence of sound between words or the endings of words.' },
        { word: 'tale', syllables: 'tale', hint: 'A fictitious or true narrative', definition: 'A fictitious or true narrative or story, especially one that is imaginatively recounted.' },
        { word: 'myth', syllables: 'myth', hint: 'A traditional story of early history', definition: 'A traditional story concerning the early history of a people or explaining a natural phenomenon.' },
        { word: 'fable', syllables: 'fa-ble', hint: 'A short story with a moral', definition: 'A short story, typically with animals as characters, conveying a moral.' },
        { word: 'legend', syllables: 'leg-end', hint: 'A traditional story regarded as historical', definition: 'A traditional story sometimes popularly regarded as historical but unauthenticated.' },
        { word: 'hero', syllables: 'he-ro', hint: 'An admired, courageous person', definition: 'A person who is admired or idealized for courage, outstanding achievements, or noble qualities.' },
        { word: 'plot', syllables: 'plot', hint: 'The main events of a story', definition: 'The main events of a play, novel, or movie, presented as an interrelated sequence.' },
        { word: 'theme', syllables: 'theme', hint: 'The topic of a piece of writing', definition: 'The subject of a talk, a piece of writing, a person\'s thoughts, or an exhibition; a topic.' },
        { word: 'author', syllables: 'au-thor', hint: 'A writer of a book', definition: 'A writer of a book, article, or report.' },
        { word: 'poet', syllables: 'po-et', hint: 'A person who writes poems', definition: 'A person who writes poems.' },
        { word: 'title', syllables: 'ti-tle', hint: 'The name of a book or artwork', definition: 'The name of a book, composition, or other artistic work.' },
        { word: 'line', syllables: 'line', hint: 'A row of written words', definition: 'A long, narrow mark or band.' },
        { word: 'verse', syllables: 'verse', hint: 'Writing arranged with a rhythm', definition: 'Writing arranged with a metrical rhythm, typically having a rhyme.' },
        { word: 'prose', syllables: 'prose', hint: 'Language in its ordinary form', definition: 'Written or spoken language in its ordinary form, without metrical structure.' },
        { word: 'act', syllables: 'act', hint: 'A main division of a play', definition: 'A main division of a play, ballet, or opera.' },
        { word: 'scene', syllables: 'scene', hint: 'A division of an act in a play', definition: 'A sequence of continuous action in a play, movie, or book.' },
        { word: 'play', syllables: 'play', hint: 'A dramatic work for the stage', definition: 'A dramatic work for the stage or to be broadcast.' },
        { word: 'stage', syllables: 'stage', hint: 'A platform where actors perform', definition: 'A raised floor or platform, typically in a theater, on which actors perform.' },
        { word: 'actor', syllables: 'ac-tor', hint: 'A person who acts on stage or in movies', definition: 'A person whose profession is acting on the stage, in movies, or on television.' },
        { word: 'role', syllables: 'role', hint: 'An actor\'s part in a play', definition: 'An actor\'s part in a play, movie, etc.' },
        { word: 'script', syllables: 'script', hint: 'The written text of a play or movie', definition: 'The written text of a play, movie, or broadcast.' },
        { word: 'quote', syllables: 'quote', hint: 'To repeat words from a text', definition: 'Repeat or copy out a group of words from a text or speech.' },
        { word: 'text', syllables: 'text', hint: 'A book or other written work', definition: 'A book or other written or printed work, regarded in terms of its content.' },
        { word: 'genre', syllables: 'gen-re', hint: 'A category of artistic work', definition: 'A category of artistic composition, characterized by similarities in form, style, or subject matter.' },
        { word: 'comic', syllables: 'com-ic', hint: 'A magazine with comic strips', definition: 'A periodical containing comic strips, intended to be humorous.' },
        { word: 'drama', syllables: 'dra-ma', hint: 'A play for theater, radio, or TV', definition: 'A play for theater, radio, or television.' },
        { word: 'novel', syllables: 'nov-el', hint: 'A long fictitious prose story', definition: 'A fictitious prose narrative of book length, representing character and action with some degree of realism.' },
        { word: 'essay', syllables: 'es-say', hint: 'A short piece of writing', definition: 'A short piece of writing on a particular subject.' },
        { word: 'letter', syllables: 'let-ter', hint: 'A written communication', definition: 'A written, typed, or printed communication, especially one sent in an envelope by mail.' },
        { word: 'diary', syllables: 'di-a-ry', hint: 'A book for daily records', definition: 'A book in which one keeps a daily record of events and experiences.' },
        { word: 'journal', syllables: 'jour-nal', hint: 'A daily record of news and events', definition: 'A newspaper or magazine that deals with a particular subject or professional activity.' },
        { word: 'art', syllables: 'art', hint: 'Expression of creative skill', definition: 'The expression of human creative skill and imagination, typically in a visual form.'},
        { word: 'draw', syllables: 'draw', hint: 'To make a picture with a pen or pencil', definition: 'Produce (a picture or diagram) by making lines and marks on paper with a pencil, pen, etc.'},
        { word: 'paint', syllables: 'paint', hint: 'To apply color to a surface', definition: 'Apply paint to (something); cover the surface of (something) with paint.'},
        { word: 'image', syllables: 'im-age', hint: 'A representation of a person or thing', definition: 'A representation of the external form of a person or thing in art.'},
        { word: 'color', syllables: 'col-or', hint: 'Hue, tint, or shade', definition: 'The property possessed by an object of producing different sensations on the eye as a result of the way it reflects or emits light.'},
        { word: 'shape', syllables: 'shape', hint: 'The external form of something', definition: 'The external form or appearance characteristic of someone or something; the outline of an area or figure.'},
        { word: 'form', syllables: 'form', hint: 'The visible shape of something', definition: 'The visible shape or configuration of something.'},
        { word: 'clay', syllables: 'clay', hint: 'Stiff, sticky earth used for pottery', definition: 'A stiff, sticky fine-grained earth, that can be molded when wet and is dried and baked to make bricks, pottery, and ceramics.'},
        { word: 'stone', syllables: 'stone', hint: 'Hard material used for sculpture', definition: 'Hard solid nonmetallic mineral matter of which rock is made, used for building and sculpture.'},
        { word: 'brush', syllables: 'brush', hint: 'An implement used for painting', definition: 'An implement with a handle, consisting of bristles, hair, or wire set into a block, used for painting.'},
        { word: 'canvas', syllables: 'can-vas', hint: 'A strong cloth used for oil painting', definition: 'A strong, coarse unbleached cloth made from hemp, flax, or a similar yarn, used to make sails and as a surface for oil painting.'},
        { word: 'music', syllables: 'mu-sic', hint: 'Art form using sound and rhythm', definition: 'The art or science of combining vocal or instrumental sounds to produce beauty of form, harmony, and expression of emotion.'},
        { word: 'band', syllables: 'band', hint: 'A group of musicians', definition: 'A group of musicians who play music together.'},
        { word: 'choir', syllables: 'choir', hint: 'A group of singers', definition: 'An organized group of singers, especially one that takes part in church services or performs in public.'},
        { word: 'note', syllables: 'note', hint: 'A single musical tone', definition: 'A single tone of definite pitch made by a musical instrument or the human voice.'},
        { word: 'beat', syllables: 'beat', hint: 'The main accent or rhythm of music', definition: 'A main accent or rhythmic unit in music or poetry.'},
        { word: 'dance', syllables: 'dance', hint: 'To move rhythmically to music', definition: 'Move rhythmically to music, typically following a set sequence of steps.'},
        { word: 'show', syllables: 'show', hint: 'A theatrical performance', definition: 'A spectacle or display, especially a theatrical performance.'},
        { word: 'film', syllables: 'film', hint: 'A motion picture or movie', definition: 'A story or event recorded by a camera as a set of moving images and shown in a theater or on television.'},
      { word: 'craft', syllables: 'craft', hint: 'An activity involving skill in making things by hand', definition: 'An activity involving skill in making things by hand.' },
        { word: 'paper', syllables: 'pa-per', hint: 'Material to write or draw on', definition: 'Material manufactured in thin sheets from wood pulp, used for writing, drawing, or printing on.' },
        { word: 'cover', syllables: 'cov-er', hint: 'The protective outside of a book', definition: 'The protective outer binding of a book.' },
        { word: 'spine', syllables: 'spine', hint: 'The part of a book’s cover on the inside', definition: 'The part of a book\'s cover that encloses the inner side of the pages.' },
        { word: 'library', syllables: 'li-brar-y', hint: 'A building containing collections of books', definition: 'A building or room containing collections of books and periodicals for use or borrowing.' },
        { word: 'chapter', syllables: 'chap-ter', hint: 'A main division of a book', definition: 'A main division of a book, typically with a number or title.' },
        { word: 'index', syllables: 'in-dex', hint: 'An alphabetical list at the end of a book', definition: 'An alphabetical list of names or subjects with references to the places they occur.' },
        { word: 'praise', syllables: 'praise', hint: 'To express warm approval of', definition: 'Express warm approval or admiration of.' },
        { word: 'review', syllables: 're-view', hint: 'A formal assessment of a work', definition: 'A formal assessment or critique of something.' },
        { word: 'style', syllables: 'style', hint: 'A manner of doing something', definition: 'A distinctive appearance, typically determined by the principles according to which something is designed.' },
        { word: 'museum', syllables: 'mu-se-um', hint: 'A building where objects of interest are stored and exhibited', definition: 'A building in which objects of historical, scientific, artistic, or cultural interest are stored and exhibited.' },
        { word: 'gallery', syllables: 'gal-ler-y', hint: 'A room or building for the display of works of art', definition: 'A room or building for the display or sale of works of art.' },
        { word: 'exhibit', syllables: 'ex-hib-it', hint: 'To publicly display a work of art', definition: 'Publicly display (a work of art or item of interest) in an art gallery or museum.' },
        { word: 'sketch', syllables: 'sketch', hint: 'A rough or unfinished drawing', definition: 'A rough or unfinished drawing or painting, often made to assist in making a more finished picture.' }
      ],
      historyAndSocialStudies: [
        // 75 words
        { word: 'past', syllables: 'past', hint: 'The time before the present', definition: 'Gone by in time and no longer existing.' },
        { word: 'king', syllables: 'king', hint: 'A male ruler', definition: 'The male ruler of an independent state, especially one who inherits the position by right of birth.' },
        { word: 'queen', syllables: 'queen', hint: 'A female ruler', definition: 'The female ruler of an independent state, especially one who inherits the position by right of birth.' },
        { word: 'war', syllables: 'war', hint: 'Armed conflict between nations', definition: 'A state of armed conflict between different nations or states.' },
        { word: 'peace', syllables: 'peace', hint: 'Freedom from disturbance', definition: 'Freedom from disturbance; tranquility.' },
        { word: 'rule', syllables: 'rule', hint: 'To exercise power over an area', definition: 'Exercise ultimate power or authority over (an area and its people).' },
        { word: 'tribe', syllables: 'tribe', hint: 'A social division in a traditional society', definition: 'A social division in a traditional society consisting of families or communities linked by common ties.' },
        { word: 'chief', syllables: 'chief', hint: 'A leader or ruler of a people', definition: 'A leader or ruler of a people or clan.' },
        { word: 'empire', syllables: 'em-pire', hint: 'A group of states under one authority', definition: 'An extensive group of states or countries under a single supreme authority.' },
        { word: 'kingdom', syllables: 'king-dom', hint: 'A country ruled by a king or queen', definition: 'A country, state, or territory ruled by a king or queen.' },
        { word: 'castle', syllables: 'cas-tle', hint: 'A large fortified building from the past', definition: 'A large building, typically of the medieval period, fortified against attack.' },
        { word: 'knight', syllables: 'knight', hint: 'A mounted soldier in armor', definition: '(in the Middle Ages) a man who served his sovereign or lord as a mounted soldier in armor.' },
        { word: 'battle', syllables: 'bat-tle', hint: 'A sustained fight between armed forces', definition: 'A sustained fight between large organized armed forces.' },
        { word: 'army', syllables: 'ar-my', hint: 'A military force for fighting on land', definition: 'An organized military force equipped for fighting on land.' },
        { word: 'navy', syllables: 'na-vy', hint: 'A military force for fighting at sea', definition: 'The branch of a nation\'s armed services that conducts military operations at sea.' },
        { word: 'soldier', syllables: 'sol-dier', hint: 'A person who serves in an army', definition: 'A person who serves in an army.' },
        { word: 'sailor', syllables: 'sail-or', hint: 'A person who works on a ship', definition: 'A person whose job it is to work as a member of the crew of a ship or boat.' },
        { word: 'ship', syllables: 'ship', hint: 'A large boat for transport by sea', definition: 'A large boat for transporting people or goods by sea or other large bodies of water.' },
        { word: 'trade', syllables: 'trade', hint: 'Buying and selling goods', definition: 'The action of buying and selling goods and services.' },
        { word: 'market', syllables: 'mar-ket', hint: 'A place for buying and selling', definition: 'A regular gathering of people for the purchase and sale of provisions, livestock, and other commodities.' },
        { word: 'gold', syllables: 'gold', hint: 'A yellow precious metal', definition: 'A yellow precious metal, used in coinage and jewelry.' },
        { word: 'spice', syllables: 'spice', hint: 'A substance used to flavor food', definition: 'An aromatic or pungent vegetable substance used to flavor food.' },
        { word: 'silk', syllables: 'silk', hint: 'A fine, strong, soft fiber', definition: 'A fine, strong, soft, lustrous fiber produced by silkworms.' },
        { word: 'explore', syllables: 'ex-plore', hint: 'To travel through an unfamiliar area', definition: 'Travel in or through (an unfamiliar country or area) in order to learn about it.' },
        { word: 'discover', syllables: 'dis-cov-er', hint: 'To find something unexpectedly', definition: 'Find (something or someone) unexpectedly or in the course of a search.' },
        { word: 'map', syllables: 'map', hint: 'A representation of an area of land', definition: 'A diagrammatic representation of an area of land or sea showing physical features, cities, roads, etc.' },
        { word: 'land', syllables: 'land', hint: 'The part of the earth not covered by water', definition: 'The part of the earth\'s surface that is not covered by water.' },
        { word: 'nation', syllables: 'na-tion', hint: 'A large body of people under one government', definition: 'A large body of people united by common descent, history, culture, or language.' },
        { word: 'country', syllables: 'coun-try', hint: 'A nation with its own government', definition: 'A nation with its own government, occupying a particular territory.' },
        { word: 'state', syllables: 'state', hint: 'A politically organized territory', definition: 'A nation or territory considered as an organized political community under one government.' },
        { word: 'city', syllables: 'ci-ty', hint: 'A large town', definition: 'A large and important town.' },
        { word: 'town', syllables: 'town', hint: 'A built-up area smaller than a city', definition: 'A built-up area with a name, defined boundaries, and local government.' },
        { word: 'village', syllables: 'vil-lage', hint: 'A group of houses in a rural area', definition: 'A group of houses and associated buildings, larger than a hamlet and smaller than a town.' },
        { word: 'farm', syllables: 'farm', hint: 'Land used for growing crops', definition: 'An area of land and its buildings used for growing crops and rearing animals.' },
        { word: 'law', syllables: 'law', hint: 'The system of rules of a country', definition: 'The system of rules which a particular country or community recognizes as regulating the actions of its members.' },
        { word: 'court', syllables: 'court', hint: 'A place where legal cases are heard', definition: 'A body of people presided over by a judge, acting as a tribunal in civil and criminal cases.' },
        { word: 'judge', syllables: 'judge', hint: 'An official who decides cases in court', definition: 'A public official appointed to decide cases in a court of law.' },
        { word: 'crime', syllables: 'crime', hint: 'An action that breaks the law', definition: 'An action or omission that constitutes an offense that may be prosecuted by the state.' },
        { word: 'prison', syllables: 'pris-on', hint: 'A place for punishing criminals', definition: 'A building in which people are legally held as a punishment for a crime.' },
        { word: 'liberty', syllables: 'lib-er-ty', hint: 'The state of being free', definition: 'The state of being free within society from oppressive restrictions.' },
        { word: 'freedom', syllables: 'free-dom', hint: 'The right to act, speak, or think as one wants', definition: 'The power or right to act, speak, or think as one wants without hindrance.' },
        { word: 'slave', syllables: 'slave', hint: 'A person who is the legal property of another', definition: 'A person who is the legal property of another and is forced to obey them.' },
        { word: 'rebel', syllables: 're-bel', hint: 'A person who resists authority', definition: 'A person who rises in opposition or armed resistance against a government or ruler.' },
        { word: 'protest', syllables: 'pro-test', hint: 'An action expressing disapproval', definition: 'A statement or action expressing disapproval of or objection to something.' },
        { word: 'vote', syllables: 'vote', hint: 'A formal indication of choice', definition: 'A formal indication of a choice between two or more candidates or courses of action.' },
        { word: 'elect', syllables: 'e-lect', hint: 'To choose someone for public office by voting', definition: 'Choose (someone) to hold public office or some other position by voting.' },
        { word: 'leader', syllables: 'lead-er', hint: 'The person who leads a group', definition: 'The person who leads or commands a group, organization, or country.' },
        { word: 'people', syllables: 'peo-ple', hint: 'Human beings in general', definition: 'Human beings in general or considered collectively.' },
        { word: 'culture', syllables: 'cul-ture', hint: 'The arts and achievements of a nation', definition: 'The arts and other manifestations of human intellectual achievement regarded collectively.' },
        { word: 'tradition', syllables: 'tra-di-tion', hint: 'Customs passed down through generations', definition: 'The transmission of customs or beliefs from generation to generation.' },
        { word: 'custom', syllables: 'cus-tom', hint: 'A traditional way of behaving', definition: 'A traditional and widely accepted way of behaving or doing something.' },
        { word: 'belief', syllables: 'be-lief', hint: 'An acceptance that something is true', definition: 'An acceptance that a statement is true or that something exists.' },
        { word: 'religion', syllables: 're-li-gion', hint: 'The belief in a god or gods', definition: 'The belief in and worship of a superhuman controlling power, especially a personal God or gods.' },
        { word: 'god', syllables: 'god', hint: 'The creator and ruler of the universe', definition: 'The creator and ruler of the universe and source of all moral authority; the supreme being.' },
        { word: 'temple', syllables: 'tem-ple', hint: 'A building for worship', definition: 'A building devoted to the worship, or regarded as the dwelling place, of a god or gods.' },
        { word: 'church', syllables: 'church', hint: 'A building for Christian worship', definition: 'A building used for public Christian worship.' },
        { word: 'tool', syllables: 'tool', hint: 'A device used to carry out a function', definition: 'A device or implement, especially one held in the hand, used to carry out a particular function.' },
        { word: 'weapon', syllables: 'weap-on', hint: 'A thing designed for inflicting harm', definition: 'A thing designed or used for inflicting bodily harm or physical damage.' },
        { word: 'fire', syllables: 'fire', hint: 'A discovery that changed human history', definition: 'Combustion or burning, essential for cooking, warmth, and early technology.' },
        { word: 'wheel', syllables: 'wheel', hint: 'A circular object that revolves on an axle', definition: 'A circular object that revolves on an axle and is fixed below a vehicle to enable it to move.' },
        { word: 'writing', syllables: 'writ-ing', hint: 'The skill of marking coherent words', definition: 'The activity or skill of marking coherent words on paper and composing text.' },
        { word: 'history', syllables: 'his-to-ry', hint: 'The study of past events', definition: 'The study of past events, particularly in human affairs.' },
        { word: 'home', syllables: 'home', hint: 'The place where one lives', definition: 'The place where one lives permanently, especially as a member of a family or household.'},
        { word: 'family', syllables: 'fam-i-ly', hint: 'A group of related people', definition: 'A group consisting of parents and children living together in a household.'},
        { word: 'job', syllables: 'job', hint: 'A paid position of regular employment', definition: 'A paid position of regular employment.'},
        { word: 'money', syllables: 'mon-ey', hint: 'A medium of exchange', definition: 'A current medium of exchange in the form of coins and banknotes.'},
        { word: 'tax', syllables: 'tax', hint: 'A compulsory contribution to state revenue', definition: 'A compulsory contribution to state revenue, levied by the government on workers\' income and business profits.'},
        { word: 'vote', syllables: 'vote', hint: 'To express a choice in an election', definition: 'A formal indication of a choice between two or more candidates or courses of action.'},
        { word: 'citizen', syllables: 'cit-i-zen', hint: 'A legally recognized subject of a state', definition: 'A legally recognized subject or national of a state or commonwealth, either native or naturalized.'},
        { word: 'border', syllables: 'bor-der', hint: 'A line separating two countries', definition: 'A line separating two political or geographical areas, especially countries.'},
        { word: 'flag', syllables: 'flag', hint: 'A piece of cloth, a symbol of a country', definition: 'A piece of cloth or similar material, typically oblong or square, attachable by one edge to a pole or rope and used as the symbol or emblem of a country.'},
        { word: 'ruler', syllables: 'rul-er', hint: 'A person exercising government', definition: 'A person exercising government or dominion.'},
        { word: 'event', syllables: 'e-vent', hint: 'A thing that happens, especially one of importance', definition: 'A thing that happens, especially one of importance.'},
        { word: 'century', syllables: 'cen-tu-ry', hint: 'A period of one hundred years', definition: 'A period of one hundred years.'}
      ],
      natureAndGeography: [
        // 75 words
        { word: 'tree', syllables: 'tree', hint: 'Tall plant with branches', definition: 'A woody perennial plant, typically having a single stem or trunk growing to a considerable height.' },
        { word: 'bird', syllables: 'bird', hint: 'Flying animal with feathers', definition: 'A warm-blooded egg-laying vertebrate distinguished by the possession of feathers, wings, and a beak.' },
        { word: 'fish', syllables: 'fish', hint: 'Swimming animal in water', definition: 'A limbless cold-blooded vertebrate animal with gills and fins and living wholly in water.' },
        { word: 'flower', syllables: 'flow-er', hint: 'Colorful part of a plant', definition: 'The seed-bearing part of a plant, consisting of reproductive organs that are typically surrounded by a brightly colored corolla.' },
        { word: 'grass', syllables: 'grass', hint: 'Green ground cover', definition: 'Vegetation consisting of typically short plants with long, narrow leaves.' },
        { word: 'lake', syllables: 'lake', hint: 'Large body of water surrounded by land', definition: 'A large body of water surrounded by land.' },
        { word: 'river', syllables: 'riv-er', hint: 'A large natural stream of water', definition: 'A large natural stream of water flowing in a channel to the sea, a lake, or another such stream.' },
        { word: 'ocean', syllables: 'o-cean', hint: 'A very large expanse of sea', definition: 'A very large expanse of sea, in particular each of the main areas into which the sea is divided geographically.' },
        { word: 'sea', syllables: 'sea', hint: 'The salt water that covers most of the earth', definition: 'The expanse of salt water that surrounds the continents and covers more than two-thirds of the surface of the earth.' },
        { word: 'beach', syllables: 'beach', hint: 'A sandy or pebbly shore', definition: 'A pebbly or sandy shore, especially by the ocean between high- and low-water marks.' },
        { word: 'sand', syllables: 'sand', hint: 'Loose grains of rock on a shore or desert', definition: 'A loose granular substance, typically pale yellowish brown, resulting from the erosion of siliceous and other rocks.' },
        { word: 'shell', syllables: 'shell', hint: 'The hard protective outer case of a sea creature', definition: 'The hard protective outer case of a mollusk or crustacean.' },
        { word: 'wave', syllables: 'wave', hint: 'A body of water curling into an arched form', definition: 'A long body of water curling into an arched form and breaking on the shore.' },
        { word: 'island', syllables: 'is-land', hint: 'A piece of land surrounded by water', definition: 'A piece of land completely surrounded by water.' },
        { word: 'hill', syllables: 'hill', hint: 'A naturally raised area of land', definition: 'A naturally raised area of land, not as high or craggy as a mountain.' },
        { word: 'mountain', syllables: 'moun-tain', hint: 'A large natural elevation of the earth’s surface', definition: 'A large natural elevation of the earth\'s surface rising abruptly from the surrounding level; a large steep hill.' },
        { word: 'valley', syllables: 'val-ley', hint: 'A low area between hills or mountains', definition: 'A low area of land between hills or mountains, typically with a river or stream flowing through it.' },
        { word: 'forest', syllables: 'for-est', hint: 'A large area covered chiefly with trees', definition: 'A large area covered chiefly with trees and undergrowth.' },
        { word: 'jungle', syllables: 'jun-gle', hint: 'An area with dense forest and tangled vegetation', definition: 'An area of land overgrown with dense forest and tangled vegetation, typically in the tropics.' },
        { word: 'desert', syllables: 'des-ert', hint: 'A dry, barren area of land', definition: 'A barren or desolate area, especially one with little or no vegetation.' },
        { word: 'cave', syllables: 'cave', hint: 'A large underground chamber', definition: 'A large underground chamber, typically of natural origin, in a hillside or cliff.' },
        { word: 'leaf', syllables: 'leaf', hint: 'A flattened green structure of a plant', definition: 'A flattened structure of a higher plant, typically green and bladelike, that is attached to a stem.' },
        { word: 'root', syllables: 'root', hint: 'The part of a plant that attaches it to the ground', definition: 'The part of a plant which attaches it to the ground, conveying water and nourishment to the rest of the plant.' },
        { word: 'stem', syllables: 'stem', hint: 'The main body or stalk of a plant', definition: 'The main body or stalk of a plant or shrub.' },
        { word: 'seed', syllables: 'seed', hint: 'A flowering plant\'s unit of reproduction', definition: 'A flowering plant\'s unit of reproduction, capable of developing into another such plant.' },
        { word: 'fruit', syllables: 'fruit', hint: 'The sweet, fleshy product of a tree or plant', definition: 'The sweet, fleshy product of a tree or other plant that contains seed and can be eaten as food.' },
        { word: 'animal', syllables: 'an-i-mal', hint: 'A living organism that feeds on organic matter', definition: 'A living organism that feeds on organic matter, typically having specialized sense organs.' },
        { word: 'insect', syllables: 'in-sect', hint: 'A small animal that has six legs', definition: 'A small arthropod animal that has six legs and generally one or two pairs of wings.' },
        { word: 'ant', syllables: 'ant', hint: 'A small insect living in a complex social colony', definition: 'A small insect, typically living in a complex social colony with one or more breeding queens.' },
        { word: 'bee', syllables: 'bee', hint: 'A stinging winged insect that collects nectar', definition: 'A stinging winged insect that collects nectar and pollen, and lives in large communities.' },
        { word: 'spider', syllables: 'spi-der', hint: 'An eight-legged predatory creature', definition: 'An eight-legged predatory arachnid with an unsegmented body.' },
        { word: 'snake', syllables: 'snake', hint: 'A long limbless reptile', definition: 'A long limbless reptile that has no eyelids, a short tail, and jaws capable of considerable extension.' },
        { word: 'frog', syllables: 'frog', hint: 'A tailless amphibian with long hind legs for leaping', definition: 'A tailless amphibian with a short squat body, moist smooth skin, and very long hind legs for leaping.' },
        { word: 'bear', syllables: 'bear', hint: 'A large, heavy mammal with thick fur', definition: 'A large, heavy mammal that walks on the soles of its feet, with thick fur and a very short tail.' },
        { word: 'wolf', syllables: 'wolf', hint: 'A wild carnivorous mammal of the dog family', definition: 'A wild carnivorous mammal of the dog family, living and hunting in packs.' },
        { word: 'fox', syllables: 'fox', hint: 'A mammal with a pointed snout and bushy tail', definition: 'A carnivorous mammal of the dog family with a pointed snout and a bushy tail.' },
        { word: 'deer', syllables: 'deer', hint: 'A hoofed animal with branched bony antlers', definition: 'A hoofed grazing or Browse animal, with branched bony antlers that are shed annually.' },
        { word: 'lion', syllables: 'li-on', hint: 'A large carnivorous feline of Africa and India', definition: 'A large carnivorous feline cat that has a tawny coat with a shaggy mane in the male.' },
        { word: 'tiger', syllables: 'ti-ger', hint: 'A large solitary cat with a yellow-brown striped coat', definition: 'A very large solitary cat with a yellow-brown coat striped with black, native to the forests of Asia.' },
        { word: 'monkey', syllables: 'mon-key', hint: 'A primate that typically has a long tail', definition: 'A small to medium-sized primate that typically has a long tail and lives in trees.' },
        { word: 'climate', syllables: 'cli-mate', hint: 'The weather conditions in an area in general', definition: 'The weather conditions prevailing in an area in general or over a long period.' },
        { word: 'weather', syllables: 'weath-er', hint: 'The state of the atmosphere at a place', definition: 'The state of the atmosphere at a place and time as regards heat, dryness, sunshine, wind, rain, etc.' },
        { word: 'season', syllables: 'sea-son', hint: 'Each of the four divisions of the year', definition: 'Each of the four divisions of the year (spring, summer, autumn, and winter) marked by particular weather patterns.' },
        { word: 'spring', syllables: 'spring', hint: 'The season after winter and before summer', definition: 'The season after winter and before summer, in which vegetation begins to appear.' },
        { word: 'summer', syllables: 'sum-mer', hint: 'The warmest season of the year', definition: 'The warmest season of the year, in the northern hemisphere from June to August.' },
        { word: 'autumn', syllables: 'au-tumn', hint: 'The season after summer and before winter', definition: 'The season after summer and before winter, also called fall.' },
        { word: 'winter', syllables: 'win-ter', hint: 'The coldest season of the year', definition: 'The coldest season of the year, in the northern hemisphere from December to February.' },
        { word: 'tide', syllables: 'tide', hint: 'The alternate rising and falling of the sea', definition: 'The alternate rising and falling of the sea, due to the attraction of the moon and sun.' },
        { word: 'stream', syllables: 'stream', hint: 'A small, narrow river', definition: 'A small, narrow river.' },
        { word: 'pond', syllables: 'pond', hint: 'A small body of still water', definition: 'A small body of still water formed naturally or by hollowing or embanking.'},
        { word: 'coast', syllables: 'coast', hint: 'The part of the land near the sea', definition: 'The part of the land adjoining or near the sea.'},
        { word: 'bay', syllables: 'bay', hint: 'A broad inlet of the sea where the land curves inward', definition: 'A broad inlet of the sea where the land curves inward.'},
        { word: 'peninsula', syllables: 'pen-in-su-la', hint: 'A piece of land almost surrounded by water', definition: 'A piece of land almost surrounded by water or projecting out into a body of water.'},
        { word: 'continent', syllables: 'con-ti-nent', hint: 'Any of the world\'s main continuous expanses of land', definition: 'Any of the world\'s main continuous expanses of land (Africa, Antarctica, Asia, Australia, Europe, North America, South America).'},
        { word: 'pole', syllables: 'pole', hint: 'The northernmost or southernmost point of the Earth', definition: 'Either of the two locations (North Pole or South Pole) on the surface of the earth that are the northern and southern ends of the axis of rotation.'},
        { word: 'equator', syllables: 'e-qua-tor', hint: 'An imaginary line around the middle of the earth', definition: 'An imaginary line drawn on the earth equally distant from both poles, dividing the earth into northern and southern hemispheres.'},
        { word: 'hemisphere', syllables: 'hem-i-sphere', hint: 'A half of the earth', definition: 'A half of the earth, usually as divided into northern and southern halves by the equator.'},
        { word: 'latitude', syllables: 'lat-i-tude', hint: 'The distance of a place north or south of the equator', definition: 'The angular distance of a place north or south of the earth\'s equator, usually expressed in degrees and minutes.'},
        { word: 'longitude', syllables: 'lon-gi-tude', hint: 'The distance of a place east or west of the Greenwich meridian', definition: 'The angular distance of a place east or west of the meridian at Greenwich, England, expressed in degrees and minutes.'},
        { word: 'zone', syllables: 'zone', hint: 'An area with particular characteristics', definition: 'An area or stretch of land having a particular characteristic, purpose, or use, or subject to particular restrictions.'},
        { word: 'region', syllables: 're-gion', hint: 'An area of a country or the world', definition: 'An area, especially part of a country or the world having definable characteristics but not always fixed boundaries.'},
        { word: 'terrain', syllables: 'ter-rain', hint: 'A stretch of land, especially with regard to its physical features', definition: 'A stretch of land, especially with regard to its physical features.'},
        { word: 'creek', syllables: 'creek', hint: 'A small stream', definition: 'A stream, brook, or minor tributary of a river.'},
        { word: 'shore', syllables: 'shore', hint: 'The land along the edge of a sea, lake, or river', definition: 'The land along the edge of a sea, lake, or wide river.'},
        { word: 'fauna', syllables: 'fau-na', hint: 'The animals of a particular region', definition: 'The animals of a particular region, habitat, or geological period.'},
        { word: 'flora', syllables: 'flo-ra', hint: 'The plants of a particular region', definition: 'The plants of a particular region, habitat, or geological period.'},
        { word: 'habitat', syllables: 'hab-i-tat', hint: 'The natural home of an animal or plant', definition: 'The natural home or environment of an animal, plant, or other organism.'},
        { word: 'species', syllables: 'spe-cies', hint: 'A group of living organisms consisting of similar individuals', definition: 'A group of living organisms consisting of similar individuals capable of exchanging genes or interbreeding.'},
        { word: 'predator', syllables: 'pred-a-tor', hint: 'An animal that naturally preys on others', definition: 'An animal that naturally preys on others.'},
        { word: 'prey', syllables: 'prey', hint: 'An animal that is hunted and killed by another for food', definition: 'An animal that is hunted and killed by another for food.'},
        { word: 'web', syllables: 'web', hint: 'A network of fine threads constructed by a spider', definition: 'A network of fine threads constructed by a spider from fluid secreted by its spinnerets, used to catch its prey.'},
        { word: 'nest', syllables: 'nest', hint: 'A structure built by a bird for laying eggs', definition: 'A structure or place made or chosen by a bird for laying eggs and sheltering its young.'},
        { word: 'den', syllables: 'den', hint: 'A wild animal\'s lair or home', definition: 'A wild mammal\'s hidden home; a lair.'}
      ],
      academicLanguage: [
        // 75 words
        { word: 'school', syllables: 'school', hint: 'A place for educating children', definition: 'An institution for educating children.' },
        { word: 'learn', syllables: 'learn', hint: 'To gain knowledge or skill', definition: 'Gain or acquire knowledge of or skill in (something) by study, experience, or being taught.' },
        { word: 'teach', syllables: 'teach', hint: 'To show someone how to do something', definition: 'Show or explain to (someone) how to do something.' },
        { word: 'teacher', syllables: 'teach-er', hint: 'A person who teaches', definition: 'A person who teaches, especially in a school.' },
        { word: 'student', syllables: 'stu-dent', hint: 'A person studying at a school', definition: 'A person who is studying at a school or college.' },
        { word: 'class', syllables: 'class', hint: 'A group of students taught together', definition: 'A group of students who are taught together.' },
        { word: 'grade', syllables: 'grade', hint: 'A level of academic achievement', definition: 'A particular level of rank, quality, proficiency, or value.' },
        { word: 'test', syllables: 'test', hint: 'A procedure to check knowledge', definition: 'A procedure intended to establish the quality, performance, or reliability of something.' },
        { word: 'exam', syllables: 'ex-am', hint: 'A formal test of knowledge', definition: 'A formal test of a person\'s knowledge or proficiency in a particular subject or skill.' },
        { word: 'quiz', syllables: 'quiz', hint: 'A brief, informal test', definition: 'A test of knowledge, especially as a competition between individuals or teams.' },
        { word: 'homework', syllables: 'home-work', hint: 'Schoolwork done at home', definition: 'Schoolwork that a student is required to do at home.' },
        { word: 'project', syllables: 'pro-ject', hint: 'A planned enterprise to achieve an aim', definition: 'An individual or collaborative enterprise that is carefully planned to achieve a particular aim.' },
        { word: 'report', syllables: 're-port', hint: 'An account of a particular matter', definition: 'An account given of a particular matter, after investigation or consideration.' },
        { word: 'subject', syllables: 'sub-ject', hint: 'A branch of knowledge studied', definition: 'A branch of knowledge studied or taught in a school, college, or university.' },
        { word: 'math', syllables: 'math', hint: 'The study of numbers and shapes', definition: 'The abstract science of number, quantity, and space.' },
        { word: 'science', syllables: 'sci-ence', hint: 'The study of the natural world', definition: 'The systematic study of the structure and behavior of the physical and natural world.' },
        { word: 'history', syllables: 'his-to-ry', hint: 'The study of past events', definition: 'The study of past events, particularly in human affairs.' },
        { word: 'art', syllables: 'art', hint: 'The expression of creative skill', definition: 'The expression of human creative skill, typically in a visual form such as painting or sculpture.' },
        { word: 'music', syllables: 'mu-sic', hint: 'The art of arranging sounds', definition: 'Vocal or instrumental sounds combined to produce beauty of form, harmony, and emotion.' },
        { word: 'gym', syllables: 'gym', hint: 'A place for physical exercise', definition: 'A gymnasium.' },
        { word: 'library', syllables: 'li-brar-y', hint: 'A place with a collection of books', definition: 'A building or room containing collections of books and other materials for reading and borrowing.' },
        { word: 'lesson', syllables: 'les-son', hint: 'A period of time for teaching', definition: 'A period of time in which a person is taught about a subject or how to do something.' },
        { word: 'course', syllables: 'course', hint: 'A series of lessons on a subject', definition: 'A series of lessons or lectures in a particular subject.' },
        { word: 'degree', syllables: 'de-gree', hint: 'An academic rank from a college', definition: 'An academic rank conferred by a college or university after successful completion of a course of study.' },
        { word: 'college', syllables: 'col-lege', hint: 'An institution for higher education', definition: 'An educational institution or establishment, providing higher education or specialized training.' },
        { word: 'campus', syllables: 'cam-pus', hint: 'The grounds of a university or college', definition: 'The grounds and buildings of a university or college.' },
        { word: 'pencil', syllables: 'pen-cil', hint: 'An instrument for writing or drawing', definition: 'An instrument for writing or drawing, consisting of a thin stick of graphite encased in wood.' },
        { word: 'pen', syllables: 'pen', hint: 'An instrument for writing with ink', definition: 'An instrument for writing or drawing with ink.' },
        { word: 'notebook', syllables: 'note-book', hint: 'A small book for writing notes', definition: 'A small book with blank or ruled pages for writing notes in.' },
        { word: 'paper', syllables: 'pa-per', hint: 'Material for writing on', definition: 'Material manufactured in thin sheets from the pulp of wood, used for writing or printing.' },
        { word: 'glue', syllables: 'glue', hint: 'An adhesive substance', definition: 'An adhesive substance used for sticking objects or materials together.' },
        { word: 'ruler', syllables: 'rul-er', hint: 'A straight strip for measuring', definition: 'A straight-edged strip of rigid material, marked at regular intervals, used to measure or draw straight lines.' },
        { word: 'computer', syllables: 'com-pu-ter', hint: 'An electronic device for processing data', definition: 'An electronic device for storing and processing data, according to instructions in a program.' },
        { word: 'screen', syllables: 'screen', hint: 'A flat panel for displaying images', definition: 'A flat panel on an electronic device on which images and data are displayed.' },
        { word: 'research', syllables: 're-search', hint: 'The systematic investigation to establish facts', definition: 'The systematic investigation into and study of materials and sources in order to establish facts and reach new conclusions.' },
        { word: 'study', syllables: 'stud-y', hint: 'Devoting time to acquire knowledge', definition: 'The devotion of time and attention to acquiring knowledge on an academic subject.' },
        { word: 'knowledge', syllables: 'knowl-edge', hint: 'Facts and skills from experience or education', definition: 'Facts, information, and skills acquired by a person through experience or education.' },
        { word: 'information', syllables: 'in-for-ma-tion', hint: 'Facts learned about something', definition: 'Facts provided or learned about something or someone.' },
        { word: 'education', syllables: 'ed-u-ca-tion', hint: 'The process of systematic instruction', definition: 'The process of receiving or giving systematic instruction, especially at a school or university.' },
        { word: 'topic', syllables: 'top-ic', hint: 'A matter dealt with in a text or talk', definition: 'A matter dealt with in a text, discourse, or conversation; a subject.'},
        { word: 'title', syllables: 'ti-tle', hint: 'The name of a book or essay', definition: 'The name of a book, composition, or other artistic work.'},
        { word: 'author', syllables: 'au-thor', hint: 'The writer of a work', definition: 'A writer of a book, article, or report.'},
        { word: 'source', syllables: 'source', hint: 'A place, person, or thing from which something comes', definition: 'A place, person, or thing from which something can be obtained.'},
        { word: 'fact', syllables: 'fact', hint: 'Something known to be true', definition: 'A thing that is known or proved to be true.'},
        { word: 'opinion', syllables: 'o-pin-ion', hint: 'A view or judgment not based on fact', definition: 'A view or judgment formed about something, not necessarily based on fact or knowledge.'},
        { word: 'idea', syllables: 'i-de-a', hint: 'A thought or suggestion', definition: 'A thought or suggestion as to a possible course of action.'},
        { word: 'point', syllables: 'point', hint: 'The main idea of an argument', definition: 'The tapering, sharp end of a tool, weapon, or other object.'},
        { word: 'reason', syllables: 'rea-son', hint: 'A cause or explanation for an action or event', definition: 'A cause, explanation, or justification for an action or event.'},
        { word: 'result', syllables: 're-sult', hint: 'A consequence or outcome', definition: 'A consequence, effect, or outcome of something.'},
        { word: 'goal', syllables: 'goal', hint: 'The object of a person’s ambition', definition: 'The object of a person\'s ambition or effort; an aim or desired result.'},
        { word: 'plan', syllables: 'plan', hint: 'A detailed proposal for doing something', definition: 'A detailed proposal for doing or achieving something.'},
        { word: 'skill', syllables: 'skill', hint: 'The ability to do something well', definition: 'The ability to do something well; expertise.'},
        { word: 'task', syllables: 'task', hint: 'A piece of work to be done', definition: 'A piece of work to be done or undertaken.'},
        { word: 'group', syllables: 'group', hint: 'A number of people working together', definition: 'A number of people or things that are located, gathered, or classed together.'},
        { word: 'team', syllables: 'team', hint: 'People working together on a task', definition: 'A group of players forming one side in a competitive game or sport.'},
        { word: 'partner', syllables: 'part-ner', hint: 'A person who takes part in an undertaking with another', definition: 'A person who takes part in an undertaking with another or others, especially in a business.'},
        { word: 'question', syllables: 'ques-tion', hint: 'A sentence worded to elicit information', definition: 'A sentence worded or expressed so as to elicit information.'},
        { word: 'answer', syllables: 'an-swer', hint: 'A thing said or written to deal with a question', definition: 'A thing said, written, or done to deal with a question, statement, or situation.'},
        { word: 'define', syllables: 'de-fine', hint: 'To state the exact meaning of a word', definition: 'State or describe exactly the nature, scope, or meaning of.'},
        { word: 'explain', syllables: 'ex-plain', hint: 'To make an idea clear to someone', definition: 'Make (an idea, situation, or problem) clear to someone by describing it in more detail.'},
        { word: 'describe', syllables: 'de-scribe', hint: 'To give a detailed account of', definition: 'Give a detailed account in words of.'},
        { word: 'compare', syllables: 'com-pare', hint: 'To note the similarity between things', definition: 'Estimate, measure, or note the similarity or dissimilarity between.'},
        { word: 'contrast', syllables: 'con-trast', hint: 'To note the difference between things', definition: 'The state of being strikingly different from something else.'},
        { word: 'summary', syllables: 'sum-ma-ry', hint: 'A brief statement of the main points', definition: 'A brief statement or account of the main points of something.'},
        { word: 'outline', syllables: 'out-line', hint: 'A general description of the main features', definition: 'A general description or plan showing the essential features of something but not the detail.'},
        { word: 'draft', syllables: 'draft', hint: 'A preliminary version of a piece of writing', definition: 'A preliminary version of a piece of writing.'},
        { word: 'edit', syllables: 'ed-it', hint: 'To prepare written material for publication by correcting it', definition: 'Prepare (written material) for publication by correcting, condensing, or otherwise modifying it.'},
        { word: 'revise', syllables: 're-vise', hint: 'To re-examine and make alterations to written material', definition: 'Re-examine and make alterations to (written or printed matter).'},
        { word: 'publish', syllables: 'pub-lish', hint: 'To prepare and issue a book for public sale', definition: 'Prepare and issue (a book, journal, piece of music, or other work) for public sale.'},
        { word: 'term', syllables: 'term', hint: 'A word or phrase used to describe a thing', definition: 'A word or phrase used to describe a thing or to express a concept, especially in a particular kind of language or branch of study.'},
        { word: 'concept', syllables: 'con-cept', hint: 'An abstract idea', definition: 'An abstract idea; a general notion.'},
        { word: 'method', syllables: 'meth-od', hint: 'A particular procedure for accomplishing something', definition: 'A particular form of procedure for accomplishing or approaching something, especially a systematic or established one.'},
        { word: 'data', syllables: 'da-ta', hint: 'Facts and statistics collected for analysis', definition: 'Facts and statistics collected together for reference or analysis.'}
      ]
    },
    medium: {
      generalVocabulary: [
        // 75 words
        { word: 'beautiful', syllables: 'beau-ti-ful', hint: 'Very pretty or attractive', definition: 'Pleasing the senses or mind aesthetically.' },
        { word: 'computer', syllables: 'com-pu-ter', hint: 'Electronic device for processing data', definition: 'An electronic device for storing and processing data.' },
        { word: 'wonderful', syllables: 'won-der-ful', hint: 'Extremely good or impressive', definition: 'Inspiring delight, pleasure, or admiration; marvelous.' },
        { word: 'important', syllables: 'im-por-tant', hint: 'Having great significance', definition: 'Of great significance or value; likely to have a profound effect.' },
        { word: 'different', syllables: 'dif-fer-ent', hint: 'Not the same as another', definition: 'Not the same as another or each other; unlike in nature, form, or quality.' },
        { word: 'interesting', syllables: 'in-ter-est-ing', hint: 'Arousing curiosity', definition: 'Arousing curiosity or interest; holding or catching the attention.' },
        { word: 'government', syllables: 'gov-ern-ment', hint: 'The system of ruling a country', definition: 'The governing body of a nation, state, or community.' },
        { word: 'education', syllables: 'ed-u-ca-tion', hint: 'The process of learning', definition: 'The process of receiving or giving systematic instruction.' },
        { word: 'experience', syllables: 'ex-pe-ri-ence', hint: 'Knowledge gained through involvement', definition: 'Practical contact with and observation of facts or events.' },
        { word: 'character', syllables: 'char-ac-ter', hint: 'A person\'s moral qualities', definition: 'The mental and moral qualities distinctive to an individual.' },
        { word: 'language', syllables: 'lan-guage', hint: 'The method of human communication', definition: 'The method of human communication, either spoken or written.' },
        { word: 'knowledge', syllables: 'knowl-edge', hint: 'Facts and information acquired', definition: 'Facts, information, and skills acquired through experience or education.' },
        { word: 'information', syllables: 'in-for-ma-tion', hint: 'Facts provided or learned', definition: 'Facts provided or learned about something or someone.' },
        { word: 'community', syllables: 'com-mu-ni-ty', hint: 'A group of people living in the same place', definition: 'A group of people living in the same place or having a particular characteristic in common.' },
        { word: 'business', syllables: 'busi-ness', hint: 'A person\'s regular occupation', definition: 'A person\'s regular occupation, profession, or trade.' },
        { word: 'company', syllables: 'com-pa-ny', hint: 'A commercial business', definition: 'A commercial business.' },
        { word: 'industry', syllables: 'in-dus-try', hint: 'Economic activity with raw materials', definition: 'Economic activity concerned with the processing of raw materials and manufacture of goods.' },
        { word: 'technology', syllables: 'tech-nol-o-gy', hint: 'Application of scientific knowledge', definition: 'The application of scientific knowledge for practical purposes, especially in industry.' },
        { word: 'president', syllables: 'pres-i-dent', hint: 'The elected head of a republic', definition: 'The elected head of a republican state.' },
        { word: 'secretary', syllables: 'sec-re-tar-y', hint: 'A person who assists with administrative tasks', definition: 'A person employed to assist with correspondence, keep records, and make appointments.' },
        { word: 'manager', syllables: 'man-ag-er', hint: 'A person responsible for controlling an organization', definition: 'A person responsible for controlling or administering an organization or group of staff.' },
        { word: 'employee', syllables: 'em-ploy-ee', hint: 'A person employed for wages', definition: 'A person employed for wages or salary, especially at a non-executive level.' },
        { word: 'customer', syllables: 'cus-tom-er', hint: 'A person who buys goods or services', definition: 'A person or organization that buys goods or services from a store or business.' },
        { word: 'product', syllables: 'prod-uct', hint: 'An article manufactured for sale', definition: 'An article or substance that is manufactured or refined for sale.' },
        { word: 'service', syllables: 'ser-vice', hint: 'The action of helping or doing work for someone', definition: 'The action of helping or doing work for someone.' },
        { word: 'quality', syllables: 'qual-i-ty', hint: 'The standard of something measured against others', definition: 'The standard of something as measured against other things of a similar kind.' },
        { word: 'quantity', syllables: 'quan-ti-ty', hint: 'The amount or number of something', definition: 'The amount or number of a material or abstract thing.' },
        { word: 'solution', syllables: 'so-lu-tion', hint: 'A means of solving a problem', definition: 'A means of solving a problem or dealing with a difficult situation.' },
        { word: 'problem', syllables: 'prob-lem', hint: 'A matter regarded as unwelcome', definition: 'A matter or situation regarded as unwelcome or harmful and needing to be dealt with.' },
        { word: 'question', syllables: 'ques-tion', hint: 'A sentence designed to elicit information', definition: 'A sentence worded or expressed so as to elicit information.' },
        { word: 'answer', syllables: 'an-swer', hint: 'A thing said or written to deal with a question', definition: 'A thing said, written, or done to deal with a question, statement, or situation.' },
        { word: 'example', syllables: 'ex-am-ple', hint: 'A thing characteristic of its kind', definition: 'A thing characteristic of its kind or illustrating a general rule.' },
        { word: 'opinion', syllables: 'o-pin-ion', hint: 'A view or judgment about something', definition: 'A view or judgment formed about something, not necessarily based on fact or knowledge.' },
        { word: 'decision', syllables: 'de-ci-sion', hint: 'A conclusion reached after consideration', definition: 'A conclusion or resolution reached after consideration.' },
        { word: 'opportunity', syllables: 'op-por-tu-ni-ty', hint: 'Circumstances making it possible to do something', definition: 'A set of circumstances that makes it possible to do something.' },
        { word: 'challenge', syllables: 'chal-lenge', hint: 'A task that tests one\'s abilities', definition: 'A task or situation that tests someone\'s abilities.' },
        { word: 'success', syllables: 'suc-cess', hint: 'The accomplishment of an aim', definition: 'The accomplishment of an aim or purpose.' },
        { word: 'failure', syllables: 'fail-ure', hint: 'Lack of success', definition: 'An unsuccessful person or thing.' },
        { word: 'future', syllables: 'fu-ture', hint: 'The time following the present', definition: 'The time or a period of time following the moment of speaking or writing.' },
        { word: 'present', syllables: 'pres-ent', hint: 'The period of time now occurring', definition: 'The period of time now occurring.' },
        { word: 'memory', syllables: 'mem-o-ry', hint: 'The faculty by which the mind stores information', definition: 'The faculty by which the mind stores and remembers information.' },
        { word: 'imagination', syllables: 'im-ag-i-na-tion', hint: 'The faculty of forming new ideas', definition: 'The faculty or action of forming new ideas, or images or concepts not present to the senses.' },
        { word: 'creativity', syllables: 'cre-a-tiv-i-ty', hint: 'The use of original ideas', definition: 'The use of the imagination or original ideas, especially in the production of an artistic work.' },
        { word: 'intelligence', syllables: 'in-tel-li-gence', hint: 'The ability to acquire and apply knowledge', definition: 'The ability to acquire and apply knowledge and skills.' },
        { word: 'emotion', syllables: 'e-mo-tion', hint: 'A strong feeling, such as joy or anger', definition: 'A strong feeling deriving from one\'s circumstances, mood, or relationships with others.' },
        { word: 'feeling', syllables: 'feel-ing', hint: 'An emotional state or reaction', definition: 'An emotional state or reaction.' },
        { word: 'thought', syllables: 'thought', hint: 'An idea or opinion produced by thinking', definition: 'An idea or opinion produced by thinking or occurring suddenly in the mind.' },
        { word: 'believe', syllables: 'be-lieve', hint: 'To accept that something is true', definition: 'Accept (something) as true; feel sure of the truth of.' },
        { word: 'understand', syllables: 'un-der-stand', hint: 'To perceive the meaning of something', definition: 'Perceive the intended meaning of (words, a language, or a speaker).' },
        { word: 'remember', syllables: 're-mem-ber', hint: 'To be able to bring a fact to one\'s mind', definition: 'Have in or be able to bring to one\'s mind an awareness of someone or something from the past.' },
        { word: 'forget', syllables: 'for-get', hint: 'To fail to remember', definition: 'Fail to remember.' },
        { word: 'explain', syllables: 'ex-plain', hint: 'To make an idea clear by describing it', definition: 'Make (an idea, situation, or problem) clear to someone by describing it in more detail.' },
        { word: 'describe', syllables: 'de-scribe', hint: 'To give an account in words', definition: 'Give an account in words of (someone or something), including all the relevant characteristics.' },
        { word: 'compare', syllables: 'com-pare', hint: 'To note the similarity between things', definition: 'Estimate, measure, or note the similarity or dissimilarity between.' },
        { word: 'develop', syllables: 'de-vel-op', hint: 'To grow and become more advanced', definition: 'Grow or cause to grow and become more mature, advanced, or elaborate.' },
        { word: 'improve', syllables: 'im-prove', hint: 'To make or become better', definition: 'Make or become better.' },
        { word: 'increase', syllables: 'in-crease', hint: 'To become greater in size or amount', definition: 'Become or make greater in size, amount, intensity, or degree.' },
        { word: 'decrease', syllables: 'de-crease', hint: 'To become smaller in size or amount', definition: 'Make or become smaller or fewer in size, amount, intensity, or degree.' },
        { word: 'achieve', syllables: 'a-chieve', hint: 'To successfully reach a result', definition: 'Successfully bring about or reach (a desired objective) by effort, skill, or courage.' },
        { word: 'prepare', syllables: 'pre-pare', hint: 'To make something ready for use', definition: 'Make (something) ready for use or consideration.' },
        { word: 'organize', syllables: 'or-ga-nize', hint: 'To arrange into a structured whole', definition: 'Arrange into a structured whole; order.' },
        { word: 'manage', syllables: 'man-age', hint: 'To be in charge of a company', definition: 'Be in charge of (a company, organization, department, etc.); run.' },
        { word: 'communicate', syllables: 'com-mu-ni-cate', hint: 'To share or exchange information', definition: 'Share or exchange information, news, or ideas.' },
        { word: 'collaborate', syllables: 'col-lab-o-rate', hint: 'To work jointly on an activity', definition: 'Work jointly on an activity, especially to produce or create something.' },
        { word: 'negotiate', syllables: 'ne-go-ti-ate', hint: 'To obtain or bring about by discussion', definition: 'Obtain or bring about by discussion.' },
        { word: 'adventure', syllables: 'ad-ven-ture', hint: 'An unusual and exciting experience', definition: 'An unusual and exciting, typically hazardous, experience or activity.'},
        { word: 'celebrate', syllables: 'cel-e-brate', hint: 'To acknowledge a happy day with a social gathering', definition: 'Acknowledge (a significant or happy day or event) with a social gathering or enjoyable activity.'},
        { word: 'delicious', syllables: 'de-li-cious', hint: 'Highly pleasant to the taste', definition: 'Highly pleasant to the taste.'},
        { word: 'enormous', syllables: 'e-nor-mous', hint: 'Very large in size or quantity', definition: 'Very large in size, quantity, or extent.'},
        { word: 'excellent', syllables: 'ex-cel-lent', hint: 'Extremely good; outstanding', definition: 'Extremely good; outstanding.'},
        { word: 'fantastic', syllables: 'fan-tas-tic', hint: 'Extraordinarily good or attractive', definition: 'Imaginative or fanciful; remote from reality.'},
        { word: 'generous', syllables: 'gen-er-ous', hint: 'Showing a readiness to give more than is expected', definition: 'Showing a readiness to give more of something, as money or time, than is strictly necessary or expected.'},
        { word: 'hospitality', syllables: 'hos-pi-tal-i-ty', hint: 'The friendly and generous reception of guests', definition: 'The friendly and generous reception and entertainment of guests, visitors, or strangers.'},
        { word: 'immediately', syllables: 'im-me-di-ate-ly', hint: 'At once; instantly', definition: 'At once; instantly.'}
      ],
      scienceAndTechnology: [
        // 75 words
        { word: 'planet', syllables: 'plan-et', hint: 'A celestial body orbiting a star', definition: 'A celestial body moving in an elliptical orbit around a star.' },
        { word: 'oxygen', syllables: 'ox-y-gen', hint: 'Gas we breathe', definition: 'A colorless, odorless reactive gas and the life-supporting component of the air.' },
        { word: 'gravity', syllables: 'grav-i-ty', hint: 'Force that pulls things down', definition: 'The force that attracts a body toward the center of the earth.' },
        { word: 'molecule', syllables: 'mol-e-cule', hint: 'Smallest unit of a compound', definition: 'A group of atoms bonded together, the smallest fundamental unit of a chemical compound.' },
        { word: 'electric', syllables: 'e-lec-tric', hint: 'Related to electricity', definition: 'Of, worked by, charged with, or producing electricity.' },
        { word: 'chemistry', syllables: 'chem-is-try', hint: 'Science of matter and its properties', definition: 'The branch of science that deals with the identification of the substances of which matter is composed.' },
        { word: 'organism', syllables: 'or-gan-ism', hint: 'A living being', definition: 'An individual animal, plant, or single-celled life form.' },
        { word: 'biology', syllables: 'bi-ol-o-gy', hint: 'The study of living organisms', definition: 'The study of living organisms, their morphology, physiology, anatomy, behavior, and origin.' },
        { word: 'physics', syllables: 'phys-ics', hint: 'The study of matter and energy', definition: 'The branch of science concerned with the nature and properties of matter and energy.' },
        { word: 'astronomy', syllables: 'as-tron-o-my', hint: 'The study of celestial objects', definition: 'The branch of science which deals with celestial objects, space, and the physical universe.' },
        { word: 'geology', syllables: 'ge-ol-o-gy', hint: 'The study of the Earth\'s physical structure', definition: 'The science that deals with the earth\'s physical structure and substance, its history, and the processes which act on it.' },
        { word: 'ecology', syllables: 'e-col-o-gy', hint: 'The study of organisms and their environment', definition: 'The branch of biology that deals with the relations of organisms to one another and to their physical surroundings.' },
        { word: 'genetics', syllables: 'ge-net-ics', hint: 'The study of heredity and variation', definition: 'The study of heredity and the variation of inherited characteristics.' },
        { word: 'evolution', syllables: 'ev-o-lu-tion', hint: 'The process of development over time', definition: 'The process by which different kinds of living organisms are thought to have developed and diversified.' },
        { word: 'fossil', syllables: 'fos-sil', hint: 'The remains of a prehistoric organism', definition: 'The remains or impression of a prehistoric organism preserved in petrified form.' },
        { word: 'dinosaur', syllables: 'di-no-saur', hint: 'A fossil reptile of the Mesozoic era', definition: 'A fossil reptile of the Mesozoic era, often reaching an enormous size.' },
        { word: 'mammal', syllables: 'mam-mal', hint: 'A warm-blooded vertebrate animal', definition: 'A warm-blooded vertebrate animal distinguished by the possession of hair or fur and the secretion of milk.' },
        { word: 'reptile', syllables: 'rep-tile', hint: 'A cold-blooded vertebrate animal', definition: 'A vertebrate animal of a class that includes snakes, lizards, crocodiles, and turtles.' },
        { word: 'amphibian', syllables: 'am-phib-i-an', hint: 'A cold-blooded vertebrate like a frog', definition: 'A cold-blooded vertebrate animal of a class that comprises the frogs, toads, and newts.' },
        { word: 'bacteria', syllables: 'bac-te-ri-a', hint: 'A large group of unicellular microorganisms', definition: 'A member of a large group of unicellular microorganisms which have cell walls but lack organelles.' },
        { word: 'virus', syllables: 'vi-rus', hint: 'An infective agent that multiplies in living cells', definition: 'An infective agent that typically consists of a nucleic acid molecule in a protein coat.' },
        { word: 'protein', syllables: 'pro-tein', hint: 'A nutrient in food like meat and eggs', definition: 'Any of a class of nitrogenous organic compounds that are an essential part of all living organisms.' },
        { word: 'carbohydrate', syllables: 'car-bo-hy-drate', hint: 'A nutrient in food like bread and pasta', definition: 'Any of a large group of organic compounds occurring in foods and living tissues like sugars and starch.' },
        { word: 'vitamin', syllables: 'vi-ta-min', hint: 'Organic compounds essential for growth', definition: 'Any of a group of organic compounds which are essential for normal growth and nutrition.' },
        { word: 'mineral', syllables: 'min-er-al', hint: 'A solid, naturally occurring inorganic substance', definition: 'A solid inorganic substance of natural occurrence.' },
        { word: 'element', syllables: 'el-e-ment', hint: 'A pure substance of atoms with same protons', definition: 'Each of more than one hundred substances that cannot be chemically interconverted or broken down.' },
        { word: 'compound', syllables: 'com-pound', hint: 'A thing composed of two or more elements', definition: 'A thing that is composed of two or more separate elements; a mixture.' },
        { word: 'mixture', syllables: 'mix-ture', hint: 'A substance made by mixing other substances', definition: 'A substance made by mixing other substances together.' },
        { word: 'solution', syllables: 'so-lu-tion', hint: 'A liquid mixture where components are uniform', definition: 'A liquid mixture in which the minor component (the solute) is uniformly distributed within the major component (the solvent).' },
        { word: 'acid', syllables: 'ac-id', hint: 'A chemical substance that neutralizes alkalis', definition: 'A chemical substance that neutralizes alkalis, dissolves some metals, and turns litmus red.' },
        { word: 'reaction', syllables: 're-ac-tion', hint: 'A process changing substances', definition: 'A chemical process in which two or more substances act mutually on each other and are changed.' },
        { word: 'experiment', syllables: 'ex-per-i-ment', hint: 'A scientific procedure to make a discovery', definition: 'A scientific procedure undertaken to make a discovery, test a hypothesis, or demonstrate a known fact.' },
        { word: 'hypothesis', syllables: 'hy-poth-e-sis', hint: 'A proposed explanation based on limited evidence', definition: 'A supposition or proposed explanation made on the basis of limited evidence as a starting point.' },
        { word: 'observation', syllables: 'ob-ser-va-tion', hint: 'The action of observing something carefully', definition: 'The action or process of observing something or someone carefully or in order to gain information.' },
        { word: 'analysis', syllables: 'a-nal-y-sis', hint: 'Detailed examination of something', definition: 'Detailed examination of the elements or structure of something.' },
        { word: 'conclusion', syllables: 'con-clu-sion', hint: 'A judgment reached by reasoning', definition: 'A judgment or decision reached by reasoning.' },
        { word: 'variable', syllables: 'var-i-a-ble', hint: 'A factor that is liable to change', definition: 'An element, feature, or factor that is liable to vary or change.' },
        { word: 'control', syllables: 'con-trol', hint: 'A standard of comparison in an experiment', definition: 'A group or individual used as a standard of comparison for checking the results of an experiment.' },
        { word: 'diagram', syllables: 'di-a-gram', hint: 'A simplified drawing showing the structure', definition: 'A simplified drawing showing the appearance, structure, or workings of something.' },
        { word: 'theory', syllables: 'the-o-ry', hint: 'A system of ideas intended to explain something', definition: 'A system of ideas intended to explain something, especially one based on general principles.' },
        { word: 'principle', syllables: 'prin-ci-ple', hint: 'A fundamental truth or proposition', definition: 'A fundamental truth or proposition that serves as the foundation for a system of belief or reasoning.' },
        { word: 'phenomenon', syllables: 'phe-nom-e-non', hint: 'A fact or situation that is observed to happen', definition: 'A fact or situation that is observed to exist or happen, especially one whose cause is in question.' },
        { word: 'property', syllables: 'prop-er-ty', hint: 'An attribute or quality of something', definition: 'An attribute, quality, or characteristic of something.' },
        { word: 'structure', syllables: 'struc-ture', hint: 'The arrangement of parts of something complex', definition: 'The arrangement of and relations between the parts or elements of something complex.' },
        { word: 'function', syllables: 'func-tion', hint: 'The purpose natural to a person or thing', definition: 'An activity or purpose natural to or intended for a person or thing.' },
        { word: 'process', syllables: 'pro-cess', hint: 'A series of actions to achieve an end', definition: 'A series of actions or steps taken in order to achieve a particular end.' },
        { word: 'system', syllables: 'sys-tem', hint: 'A set of things working together', definition: 'A set of things working together as parts of a mechanism or an interconnecting network.' },
        { word: 'cycle', syllables: 'cy-cle', hint: 'A series of events repeated in order', definition: 'A series of events that are regularly repeated in the same order.' },
        { word: 'balance', syllables: 'bal-ance', hint: 'An even distribution of weight', definition: 'An even distribution of weight enabling something to remain upright and steady.' },
        { word: 'equilibrium', syllables: 'e-qui-lib-ri-um', hint: 'A state in which opposing forces are balanced', definition: 'A state in which opposing forces or influences are balanced.' },
        { word: 'velocity', syllables: 've-loc-i-ty', hint: 'The speed of something in a given direction', definition: 'The speed of something in a given direction.' },
        { word: 'acceleration', syllables: 'ac-cel-er-a-tion', hint: 'The rate of change of velocity', definition: 'The rate at which an object changes its velocity. An object is accelerating if it is changing its velocity.' },
        { word: 'volume', syllables: 'vol-ume', hint: 'The amount of space an object occupies', definition: 'The amount of space that a substance or object occupies, or that is enclosed within a container.' },
        { word: 'density', syllables: 'den-si-ty', hint: 'The degree of compactness of a substance', definition: 'The degree of compactness of a substance.' },
        { word: 'temperature', syllables: 'tem-per-a-ture', hint: 'The degree of heat in a substance', definition: 'The degree or intensity of heat present in a substance or object.' },
        { word: 'pressure', syllables: 'pres-sure', hint: 'The continuous physical force on an object', definition: 'The continuous physical force exerted on or against an object by something in contact with it.' },
        { word: 'spectrum', syllables: 'spec-trum', hint: 'A band of colors, as in a rainbow', definition: 'A band of colors, as seen in a rainbow, produced by separation of the components of light.' },
        { word: 'algorithm', syllables: 'al-go-rithm', hint: 'A process or set of rules to be followed in calculations', definition: 'A process or set of rules to be followed in calculations or other problem-solving operations, especially by a computer.'},
        { word: 'application', syllables: 'ap-pli-ca-tion', hint: 'A program or piece of software designed for a particular purpose', definition: 'A program or piece of software designed and written to fulfill a particular purpose of the user.'},
        { word: 'database', syllables: 'da-ta-base', hint: 'A structured set of data held in a computer', definition: 'A structured set of data held in a computer, especially one that is accessible in various ways.'},
        { word: 'interface', syllables: 'in-ter-face', hint: 'A point where two systems meet and interact', definition: 'A point where two systems, subjects, organizations, etc., meet and interact.'},
        { word: 'network', syllables: 'net-work', hint: 'A group of interconnected computers', definition: 'A set of computers connected together for the purpose of sharing resources.'},
        { word: 'server', syllables: 'serv-er', hint: 'A computer that provides data to other computers', definition: 'A computer or computer program that manages access to a centralized resource or service in a network.'},
        { word: 'software', syllables: 'soft-ware', hint: 'The programs used to operate a computer', definition: 'The programs and other operating information used by a computer.'},
        { word: 'hardware', syllables: 'hard-ware', hint: 'The physical parts of a computer', definition: 'The machines, wiring, and other physical components of a computer or other electronic system.'},
        { word: 'digital', syllables: 'dig-i-tal', hint: 'Relating to computer data using binary digits', definition: '(of a signal or data) expressed as a series of the digits 0 and 1.'},
        { word: 'virtual', syllables: 'vir-tu-al', hint: 'Not physically existing but made by software to appear so', definition: 'Not physically existing as such but made by software to appear to do so.'},
        { word: 'automation', syllables: 'au-to-ma-tion', hint: 'The use of automatic equipment in a system', definition: 'The use of largely automatic equipment in a system of manufacturing or other production process.'},
        { word: 'innovation', syllables: 'in-no-va-tion', hint: 'A new method, idea, or product', definition: 'The action or process of innovating; a new method, idea, product, etc.'},
        { word: 'prototype', syllables: 'pro-to-type', hint: 'A first or preliminary model of something', definition: 'A first, typical or preliminary model of something, especially a machine, from which other forms are developed or copied.'},
        { word: 'simulation', syllables: 'sim-u-la-tion', hint: 'The imitation of a situation or process', definition: 'The imitation of the operation of a real-world process or system over time.'},
        { word: 'component', syllables: 'com-po-nent', hint: 'A part of a larger whole', definition: 'A part or element of a larger whole, especially a part of a machine or vehicle.'},
        { word: 'mechanism', syllables: 'mech-a-nism', hint: 'A system of parts working together in a machine', definition: 'A system of parts working together in a machine; a piece of machinery.'},
        { word: 'circuit', syllables: 'cir-cuit', hint: 'A complete and closed path for an electric current', definition: 'A complete and closed path around which a circulating electric current can flow.'}
      ],
      literatureAndArts: [
        // 75 words
        { word: 'poetry', syllables: 'po-et-ry', hint: 'Literary work in verse', definition: 'Literary work in which special intensity is given to the expression of feelings and ideas by the use of distinctive style and rhythm.' },
        { word: 'metaphor', syllables: 'met-a-phor', hint: 'Figure of speech comparing two things', definition: 'A figure of speech in which a word or phrase is applied to an object or action to which it is not literally applicable.' },
        { word: 'character', syllables: 'char-ac-ter', hint: 'A person in a story', definition: 'A person in a novel, play, or movie.' },
        { word: 'narrative', syllables: 'nar-ra-tive', hint: 'A spoken or written account of events', definition: 'A spoken or written account of connected events; a story.' },
        { word: 'protagonist', syllables: 'pro-tag-o-nist', hint: 'The leading character in a story', definition: 'The leading character or one of the major characters in a drama, movie, novel, or other fictional text.' },
        { word: 'antagonist', syllables: 'an-tag-o-nist', hint: 'A person who actively opposes the main character', definition: 'A person who actively opposes or is hostile to someone or something; an adversary.' },
        { word: 'setting', syllables: 'set-ting', hint: 'The place and time where a story happens', definition: 'The place and time at which a play, novel, or film is represented as happening.' },
        { word: 'conflict', syllables: 'con-flict', hint: 'A serious disagreement or argument', definition: 'A serious disagreement or argument, typically a protracted one.' },
        { word: 'climax', syllables: 'cli-max', hint: 'The most intense or exciting point of something', definition: 'The most intense, exciting, or important point of something; a culmination or apex.' },
        { word: 'resolution', syllables: 'res-o-lu-tion', hint: 'The action of solving a problem or conflict', definition: 'The action of solving a problem, dispute, or contentious matter.' },
        { word: 'symbolism', syllables: 'sym-bol-ism', hint: 'The use of symbols to represent ideas', definition: 'The use of symbols to signify ideas and qualities by giving them symbolic meanings.' },
        { word: 'imagery', syllables: 'im-age-ry', hint: 'Visually descriptive or figurative language', definition: 'Visually descriptive or figurative language, especially in a literary work.' },
        { word: 'irony', syllables: 'i-ro-ny', hint: 'Language that signifies the opposite', definition: 'The expression of one\'s meaning by using language that normally signifies the opposite, for humorous or emphatic effect.' },
        { word: 'satire', syllables: 'sat-ire', hint: 'The use of humor to criticize people\'s stupidity', definition: 'The use of humor, irony, or exaggeration to expose and criticize people\'s stupidity or vices.' },
        { word: 'parody', syllables: 'par-o-dy', hint: 'An imitation with deliberate exaggeration', definition: 'An imitation of the style of a particular writer, artist, or genre with deliberate exaggeration for comic effect.' },
        { word: 'allegory', syllables: 'al-le-go-ry', hint: 'A story with a hidden meaning', definition: 'A story, poem, or picture that can be interpreted to reveal a hidden meaning, typically a moral or political one.' },
        { word: 'allusion', syllables: 'al-lu-sion', hint: 'An indirect or passing reference', definition: 'An expression designed to call something to mind without mentioning it explicitly; an indirect reference.' },
        { word: 'foreshadowing', syllables: 'fore-shad-ow-ing', hint: 'A warning or indication of a future event', definition: 'Be a warning or indication of (a future event).' },
        { word: 'flashback', syllables: 'flash-back', hint: 'A scene set in a time earlier than the main story', definition: 'A scene in a movie, novel, etc., set in a time earlier than the main story.' },
        { word: 'dialogue', syllables: 'di-a-logue', hint: 'Conversation between two or more people', definition: 'Conversation between two or more people as a feature of a book, play, or movie.' },
        { word: 'monologue', syllables: 'mon-o-logue', hint: 'A long speech by one actor', definition: 'A long speech by one actor in a play or movie, or as part of a theatrical or broadcast program.' },
        { word: 'soliloquy', syllables: 'so-lil-o-quy', hint: 'Speaking one\'s thoughts aloud when alone', definition: 'An act of speaking one\'s thoughts aloud when by oneself or regardless of any hearers, especially by a character in a play.' },
        { word: 'rhyme scheme', syllables: 'rhyme-scheme', hint: 'The ordered pattern of rhymes in a poem', definition: 'The ordered pattern of rhymes at the ends of the lines of a poem or verse.' },
        { word: 'alliteration', syllables: 'al-lit-er-a-tion', hint: 'Same letter or sound at the beginning of words', definition: 'The occurrence of the same letter or sound at the beginning of adjacent or closely connected words.' },
        { word: 'assonance', syllables: 'as-so-nance', hint: 'Repetition of a vowel sound in poetry', definition: 'In poetry, the repetition of the sound of a vowel in non-rhyming stressed syllables near enough for the echo to be discernible.' },
        { word: 'consonance', syllables: 'con-so-nance', hint: 'Recurrence of similar consonant sounds', definition: 'The recurrence of similar sounds, especially consonants, in close proximity.' },
        { word: 'onomatopoeia', syllables: 'on-o-mat-o-poe-ia', hint: 'A word from a sound associated with it', definition: 'The formation of a word from a sound associated with what is named (e.g., cuckoo, sizzle).' },
        { word: 'hyperbole', syllables: 'hy-per-bo-le', hint: 'Exaggerated statements not meant to be taken literally', definition: 'Exaggerated statements or claims not meant to be taken literally.' },
        { word: 'personification', syllables: 'per-son-i-fi-ca-tion', hint: 'Attributing human characteristics to something nonhuman', definition: 'The attribution of a personal nature or human characteristics to something nonhuman.' },
        { word: 'biography', syllables: 'bi-og-ra-phy', hint: 'An account of someone\'s life written by another', definition: 'An account of someone\'s life written by someone else.' },
        { word: 'autobiography', syllables: 'au-to-bi-og-ra-phy', hint: 'An account of a person\'s life written by that person', definition: 'An account of a person\'s life written by that person.' },
        { word: 'memoir', syllables: 'mem-oir', hint: 'A biography written from personal knowledge', definition: 'A historical account or biography written from personal knowledge or special sources.' },
        { word: 'fantasy', syllables: 'fan-ta-sy', hint: 'A genre of fiction with magic and adventure', definition: 'A genre of imaginative fiction involving magic and adventure, especially in a setting other than the real world.' },
        { word: 'science fiction', syllables: 'sci-ence fic-tion', hint: 'Fiction based on imagined future science', definition: 'Fiction based on imagined future scientific or technological advances and major social or environmental changes.' },
        { word: 'mystery', syllables: 'mys-ter-y', hint: 'A genre where a detective solves a crime', definition: 'A genre of fiction in which a detective solves a crime or a series of crimes.' },
        { word: 'thriller', syllables: 'thril-ler', hint: 'A genre with a great deal of suspense', definition: 'A novel, play, or movie with an exciting plot, typically involving crime or espionage.' },
        { word: 'romance', syllables: 'ro-mance', hint: 'A genre focusing on romantic love', definition: 'A genre of fiction focusing on the relationship and romantic love between two people.' },
        { word: 'comedy', syllables: 'com-e-dy', hint: 'A genre intended to be humorous', definition: 'Professional entertainment consisting of jokes and satirical sketches, intended to make an audience laugh.' },
        { word: 'tragedy', syllables: 'trag-e-dy', hint: 'A genre where the protagonist suffers sorrow', definition: 'An event causing great suffering, destruction, and distress, such as a serious accident or crime.' },
        { word: 'drama', syllables: 'dra-ma', hint: 'A composition presenting a story in dialogue', definition: 'A play for theater, radio, or television.' },
        { word: 'epic', syllables: 'ep-ic', hint: 'A long poem narrating heroic deeds', definition: 'A long poem, typically derived from ancient oral tradition, narrating the deeds of heroic or legendary figures.' },
        { word: 'folktale', syllables: 'folk-tale', hint: 'A story originating in popular culture', definition: 'A story originating in popular culture, typically passed on by word of mouth.' },
        { word: 'anthology', syllables: 'an-thol-o-gy', hint: 'A published collection of poems or other writings', definition: 'A published collection of poems or other pieces of writing.'},
        { word: 'critique', syllables: 'cri-tique', hint: 'A detailed analysis of a literary work', definition: 'A detailed analysis and assessment of something, especially a literary, philosophical, or political theory.'},
        { word: 'manuscript', syllables: 'man-u-script', hint: 'A book or document written by hand', definition: 'A book, document, or piece of music written by hand rather than typed or printed.'},
        { word: 'publication', syllables: 'pub-li-ca-tion', hint: 'A book or journal issued for public sale', definition: 'The action of making something generally known; a book or journal issued for public sale.'},
        { word: 'publisher', syllables: 'pub-lish-er', hint: 'A company that prepares and issues books', definition: 'A person or company that prepares and issues books, journals, music, or other works for sale.'},
        { word: 'aesthetic', syllables: 'aes-thet-ic', hint: 'Concerned with beauty or the appreciation of beauty', definition: 'Concerned with beauty or the appreciation of beauty.'},
        { word: 'architecture', syllables: 'ar-chi-tec-ture', hint: 'The art or practice of designing and constructing buildings', definition: 'The art or practice of designing and constructing buildings.'},
        { word: 'ballet', syllables: 'bal-let', hint: 'An artistic dance form performed to music', definition: 'An artistic dance form performed to music using precise and highly formalized set steps and gestures.'},
        { word: 'ceramics', syllables: 'ce-ram-ics', hint: 'Pots and other articles made from clay hardened by heat', definition: 'Pots and other articles made from clay hardened by heat.'},
        { word: 'choreography', syllables: 'cho-re-og-ra-phy', hint: 'The sequence of steps and movements in dance', definition: 'The sequence of steps and movements in dance or figure skating, especially in a ballet or other staged dance.'},
        { 'word': 'cinematography', 'syllables': 'cin-e-ma-tog-ra-phy', 'hint': 'The art of making motion pictures', 'definition': 'The art of making motion pictures.' },
        { 'word': 'collage', 'syllables': 'col-lage', 'hint': 'Art made from an assemblage of different forms', 'definition': 'A piece of art made by sticking various different materials such as photographs and pieces of paper or fabric onto a backing.' },
        { 'word': 'composition', 'syllables': 'com-po-si-tion', 'hint': 'The nature of something\'s ingredients or constituents', 'definition': 'The nature of something\'s ingredients or constituents; the way in which a whole or mixture is made up.' },
        { 'word': 'concert', 'syllables': 'con-cert', 'hint': 'A musical performance given in public', 'definition': 'A musical performance given in public, typically by several players or singers.' },
        { 'word': 'conductor', 'syllables': 'con-duc-tor', 'hint': 'A person who directs the performance of an orchestra', 'definition': 'A person who directs the performance of an orchestra or choir.' },
        { 'word': 'exhibition', 'syllables': 'ex-hi-bi-tion', 'hint': 'A public display of works of art', 'definition': 'A public display of works of art or items of interest, held in an art gallery or museum or at a trade fair.' },
        { 'word': 'festival', 'syllables': 'fes-ti-val', 'hint': 'A day or period of celebration', 'definition': 'A day or period of celebration, typically a religious commemoration.' },
        { 'word': 'harmony', 'syllables': 'har-mo-ny', 'hint': 'The combination of simultaneously sounded musical notes', 'definition': 'The combination of simultaneously sounded musical notes to produce chords and chord progressions having a pleasing effect.' },
        { 'word': 'illustration', 'syllables': 'il-lus-tra-tion', 'hint': 'A picture illustrating a book or newspaper', 'definition': 'A picture illustrating a book, newspaper, etc.' },
        { 'word': 'melody', 'syllables': 'mel-o-dy', 'hint': 'A sequence of single notes that is musically satisfying', 'definition': 'A sequence of single notes that is musically satisfying.' },
        { 'word': 'mural', 'syllables': 'mu-ral', 'hint': 'A painting or other work of art executed directly on a wall', 'definition': 'A painting or other work of art executed directly on a wall.' },
        { 'word': 'orchestra', 'syllables': 'or-ches-tra', 'hint': 'A large group of instrumentalists', 'definition': 'A large group of instrumentalists, especially one combining string, woodwind, brass, and percussion sections.' },
        { 'word': 'performance', 'syllables': 'per-for-mance', 'hint': 'An act of staging or presenting a play or other entertainment', 'definition': 'An act of staging or presenting a play, concert, or other form of entertainment.' },
        { 'word': 'perspective', 'syllables': 'per-spec-tive', 'hint': 'The art of drawing solid objects on a two-dimensional surface', 'definition': 'The art of drawing solid objects on a two-dimensional surface so as to give the right impression of their height, width, depth, and position in relation to each other.' },
        { 'word': 'portrait', 'syllables': 'por-trait', 'hint': 'A painting, drawing, or photograph of a person', 'definition': 'A painting, drawing, photograph, or engraving of a person, especially one depicting only the face or head and shoulders.' },
        { 'word': 'rehearsal', 'syllables': 're-hears-al', 'hint': 'A practice or trial performance', 'definition': 'A practice or trial performance of a play or other work for later public performance.' },
        { 'word': 'sculpture', 'syllables': 'sculp-ture', 'hint': 'The art of making two- or three-dimensional representative forms', 'definition': 'The art of making two- or three-dimensional representative or abstract forms, especially by carving stone or wood or by casting metal or plaster.' },
        { 'word': 'symphony', 'syllables': 'sym-pho-ny', 'hint': 'An elaborate musical composition for full orchestra', 'definition': 'An elaborate musical composition for full orchestra, typically in four movements, at least one of which is traditionally in sonata form.' },
        { 'word': 'theater', 'syllables': 'the-a-ter', 'hint': 'A building where plays, shows, or movies are performed', 'definition': 'A building or outdoor area in which plays and other dramatic performances are given.' },
        { 'word': 'audition', 'syllables': 'au-di-tion', 'hint': 'An interview for a role as a singer, actor, etc.', 'definition': 'An interview for a particular role or job as a singer, actor, dancer, or musician, consisting of a practical demonstration of the candidate\'s suitability and skill.' },
        { 'word': 'applaud', 'syllables': 'ap-plaud', 'hint': 'To show approval by clapping', 'definition': 'Show approval or praise by clapping.' },
        { 'word': 'audience', 'syllables': 'au-di-ence', 'hint': 'The assembled spectators or listeners at a public event', 'definition': 'The assembled spectators or listeners at a public event, such as a play, movie, concert, or meeting.' }
      ],
      historyAndSocialStudies: [
        // 75 words
        { word: 'ancient', syllables: 'an-cient', hint: 'Belonging to the very distant past', definition: 'Belonging to the very distant past and no longer in existence.' },
        { word: 'civilization', syllables: 'civ-i-li-za-tion', hint: 'The society, culture, and way of life of a particular area', definition: 'The stage of human social and cultural development and organization that is considered most advanced.' },
        { word: 'democracy', syllables: 'de-moc-ra-cy', hint: 'A system of government by the whole population', definition: 'A system of government by the whole population or all the eligible members of a state, typically through elected representatives.' },
        { word: 'republic', syllables: 're-pub-lic', hint: 'A state in which supreme power is held by the people', definition: 'A state in which supreme power is held by the people and their elected representatives, and which has an elected or nominated president.' },
        { word: 'monarchy', syllables: 'mon-ar-chy', hint: 'A form of government with a monarch at the head', definition: 'A form of government with a monarch at the head.' },
        { word: 'revolution', syllables: 'rev-o-lu-tion', hint: 'A forcible overthrow of a government', definition: 'A forcible overthrow of a government or social order in favor of a new system.' },
        { word: 'independence', syllables: 'in-de-pend-ence', hint: 'The fact or state of being free from control', definition: 'The fact or state of being independent.' },
        { word: 'colonization', syllables: 'col-o-ni-za-tion', hint: 'The action of settling among and establishing control over indigenous people', definition: 'The action or process of settling among and establishing control over the indigenous people of an area.' },
        { word: 'exploration', syllables: 'ex-plo-ra-tion', hint: 'The action of traveling in or through an unfamiliar area', definition: 'The action of exploring an unfamiliar area.' },
        { word: 'archaeology', syllables: 'ar-chae-ol-o-gy', hint: 'The study of human history through excavation', definition: 'The study of human history and prehistory through the excavation of sites and the analysis of artifacts and other physical remains.' },
        { word: 'artifact', syllables: 'ar-ti-fact', hint: 'An object made by a human being of cultural or historical interest', definition: 'An object made by a human being, typically an item of cultural or historical interest.' },
        { word: 'dynasty', syllables: 'dy-nas-ty', hint: 'A line of hereditary rulers of a country', definition: 'A line of hereditary rulers of a country.' },
        { word: 'feudalism', syllables: 'feu-dal-ism', hint: 'A social system in medieval Europe', definition: 'The dominant social system in medieval Europe, in which the nobility held lands from the Crown in exchange for military service.' },
        { word: 'renaissance', syllables: 'ren-ais-sance', hint: 'The revival of art and literature in the 14th–16th centuries', definition: 'The revival of art and literature under the influence of classical models in the 14th–16th centuries.' },
        { word: 'reformation', syllables: 'ref-or-ma-tion', hint: 'A 16th-century movement for the reform of the Roman Catholic Church', definition: 'A 16th-century movement for the reform of abuses in the Roman Catholic Church ending in the establishment of the Reformed and Protestant Churches.' },
        { word: 'enlightenment', syllables: 'en-light-en-ment', hint: 'A European intellectual movement of the late 17th and 18th centuries', definition: 'A European intellectual movement of the late 17th and 18th centuries emphasizing reason and individualism rather than tradition.' },
        { word: 'industrialization', syllables: 'in-dus-tri-al-i-za-tion', hint: 'The development of industries in a country on a wide scale', definition: 'The development of industries in a country or region on a wide scale.' },
        { word: 'globalization', syllables: 'glo-bal-i-za-tion', hint: 'The process by which businesses or other organizations develop international influence', definition: 'The process by which businesses or other organizations develop international influence or start operating on an international scale.' },
        { word: 'constitution', syllables: 'con-sti-tu-tion', hint: 'A body of fundamental principles according to which a state is governed', definition: 'A body of fundamental principles or established precedents according to which a state or other organization is acknowledged to be governed.' },
        { word: 'amendment', syllables: 'a-mend-ment', hint: 'A minor change or addition to a legal document', definition: 'A minor change or addition designed to improve a text, piece of legislation, etc.' },
        { word: 'legislation', syllables: 'leg-is-la-tion', hint: 'Laws, considered collectively', definition: 'Laws, considered collectively.' },
        { word: 'judiciary', syllables: 'ju-di-ci-ar-y', hint: 'The judicial authorities of a country; judges collectively', definition: 'The judicial authorities of a country; judges collectively.' },
        { word: 'executive', syllables: 'ex-ec-u-tive', hint: 'The branch of government responsible for implementing laws', definition: 'Having the power to put plans, actions, or laws into effect.' },
        { word: 'legislature', syllables: 'leg-is-la-ture', hint: 'The legislative body of a country or state', definition: 'The legislative body of a country or state.' },
        { word: 'suffrage', syllables: 'suf-frage', hint: 'The right to vote in political elections', definition: 'The right to vote in political elections.' },
        { word: 'abolition', syllables: 'ab-o-li-tion', hint: 'The action of formally putting an end to a system', definition: 'The action or an act of abolishing a system, practice, or institution.' },
        { word: 'emancipation', syllables: 'e-man-ci-pa-tion', hint: 'The fact or process of being set free from legal restrictions', definition: 'The fact or process of being set free from legal, social, or political restrictions; liberation.' },
        { word: 'immigration', syllables: 'im-mi-gra-tion', hint: 'The action of coming to live permanently in a foreign country', definition: 'The action of coming to live permanently in a foreign country.' },
        { word: 'migration', syllables: 'mi-gra-tion', hint: 'Movement of people to a new area or country', definition: 'Movement of people to a new area or country in order to find work or better living conditions.' },
        { word: 'urbanization', syllables: 'ur-ban-i-za-tion', hint: 'The process of making an area more urban', definition: 'The process of making an area more urban.' },
        { word: 'anthropology', syllables: 'an-thro-pol-o-gy', hint: 'The study of human societies and cultures', definition: 'The study of human societies and cultures and their development.' },
        { word: 'sociology', syllables: 'so-ci-ol-o-gy', hint: 'The study of the development and structure of human society', definition: 'The study of the development, structure, and functioning of human society.' },
        { word: 'psychology', syllables: 'psy-chol-o-gy', hint: 'The scientific study of the human mind and its functions', definition: 'The scientific study of the human mind and its functions, especially those affecting behavior in a given context.' },
        { word: 'economics', syllables: 'e-co-nom-ics', hint: 'The branch of knowledge concerned with the production and consumption of goods', definition: 'The branch of knowledge concerned with the production, consumption, and transfer of wealth.' },
        { word: 'geography', syllables: 'ge-og-ra-phy', hint: 'The study of the physical features of the earth', definition: 'The study of the physical features of the earth and its atmosphere, and of human activity as it affects and is affected by these.' },
        { word: 'cartography', syllables: 'car-tog-ra-phy', hint: 'The science or practice of drawing maps', definition: 'The science or practice of drawing maps.' },
        { word: 'demography', syllables: 'de-mog-ra-phy', hint: 'The study of statistics such as births, deaths, and income', definition: 'The study of statistics such as births, deaths, income, or the incidence of disease, which illustrate the changing structure of human populations.' },
        { word: 'ideology', syllables: 'i-de-ol-o-gy', hint: 'A system of ideas and ideals', definition: 'A system of ideas and ideals, especially one which forms the basis of economic or political theory and policy.' },
        { word: 'philosophy', syllables: 'phi-los-o-phy', hint: 'The study of the fundamental nature of knowledge and reality', definition: 'The study of the fundamental nature of knowledge, reality, and existence, especially when considered as an academic discipline.' },
        { word: 'theology', syllables: 'the-ol-o-gy', hint: 'The study of the nature of God and religious belief', definition: 'The study of the nature of God and religious belief.' },
        { 'word': 'mythology', 'syllables': 'my-thol-o-gy', 'hint': 'A collection of myths, especially one belonging to a particular religious or cultural tradition', 'definition': 'A collection of myths, especially one belonging to a particular religious or cultural tradition.' },
        { 'word': 'heritage', 'syllables': 'her-i-tage', 'hint': 'Property that is or may be inherited; an inheritance', 'definition': 'Property that is or may be inherited; an inheritance.' },
        { 'word': 'monument', 'syllables': 'mon-u-ment', 'hint': 'A statue, building, or other structure erected to commemorate a famous person or event', 'definition': 'A statue, building, or other structure erected to commemorate a famous or notable person or event.' },
        { 'word': 'treaty', 'syllables': 'trea-ty', 'hint': 'A formally concluded and ratified agreement between countries', 'definition': 'A formally concluded and ratified agreement between countries.' },
        { 'word': 'alliance', 'syllables': 'al-li-ance', 'hint': 'A union or association formed for mutual benefit', 'definition': 'A union or association formed for mutual benefit, especially between countries or organizations.' },
        { 'word': 'diplomacy', 'syllables': 'di-plo-ma-cy', 'hint': 'The profession, activity, or skill of managing international relations', 'definition': 'The profession, activity, or skill of managing international relations, typically by a country\'s representatives abroad.' },
        { 'word': 'ambassador', 'syllables': 'am-bas-sa-dor', 'hint': 'An accredited diplomat sent by a country as its official representative', 'definition': 'An accredited diplomat sent by a country as its official representative to a foreign country.' },
        { 'word': 'sovereignty', 'syllables': 'sov-er-eign-ty', 'hint': 'Supreme power or authority', 'definition': 'Supreme power or authority.' },
        { 'word': 'bureaucracy', 'syllables': 'bu-reauc-ra-cy', 'hint': 'A system of government in which most of the important decisions are made by state officials', 'definition': 'A system of government in which most of the important decisions are taken by state officials rather than by elected representatives.' },
        { 'word': 'capitalism', 'syllables': 'cap-i-tal-ism', 'hint': 'An economic and political system in which a country\'s trade and industry are controlled by private owners', 'definition': 'An economic and political system in which a country\'s trade and industry are controlled by private owners for profit, rather than by the state.' },
        { 'word': 'socialism', 'syllables': 'so-cial-ism', 'hint': 'A political and economic theory of social organization', 'definition': 'A political and economic theory of social organization which advocates that the means of production, distribution, and exchange should be owned or regulated by the community as a whole.' },
        { 'word': 'communism', 'syllables': 'com-mu-nism', 'hint': 'A political theory derived from Karl Marx, advocating class war', 'definition': 'A political theory derived from Karl Marx, advocating class war and leading to a society in which all property is publicly owned and each person works and is paid according to their abilities and needs.' },
        { 'word': 'nationalism', 'syllables': 'na-tion-al-ism', 'hint': 'Identification with one\'s own nation and support for its interests', 'definition': 'Identification with one\'s own nation and support for its interests, especially to the exclusion or detriment of the interests of other nations.' },
        { 'word': 'imperialism', 'syllables': 'im-pe-ri-al-ism', 'hint': 'A policy of extending a country\'s power and influence through diplomacy or military force', 'definition': 'A policy of extending a country\'s power and influence through diplomacy or military force.' },
        { 'word': 'federalism', 'syllables': 'fed-er-al-ism', 'hint': 'The federal principle or system of government', 'definition': 'The federal principle or system of government.' },
        { 'word': 'parliament', 'syllables': 'par-lia-ment', 'hint': 'The highest legislature, consisting of the sovereign, the House of Lords, and the House of Commons', 'definition': 'The highest legislature, consisting of the sovereign, the House of Lords, and the House of Commons.' },
        { 'word': 'congress', 'syllables': 'con-gress', 'hint': 'The national legislative body of a country', 'definition': 'The national legislative body of a country.' },
        { 'word': 'senate', 'syllables': 'sen-ate', 'hint': 'The smaller upper assembly in the US Congress', 'definition': 'The smaller upper assembly in the US Congress, most US states, France, and other countries.' },
        { 'word': 'judiciary', 'syllables': 'ju-di-ci-ar-y', 'hint': 'The judicial authorities of a country; judges collectively', 'definition': 'The judicial authorities of a country; judges collectively.' },
        { 'word': 'recession', 'syllables': 're-ces-sion', 'hint': 'A period of temporary economic decline', 'definition': 'A period of temporary economic decline during which trade and industrial activity are reduced, generally identified by a fall in GDP in two successive quarters.' },
        { 'word': 'depression', 'syllables': 'de-pres-sion', 'hint': 'A long and severe recession in an economy or market', 'definition': 'A long and severe recession in an economy or market.' },
        { 'word': 'inflation', 'syllables': 'in-fla-tion', 'hint': 'The rate at which the general level of prices for goods and services is rising', 'definition': 'A general increase in prices and fall in the purchasing value of money.' },
        { 'word': 'tariff', 'syllables': 'tar-iff', 'hint': 'A tax or duty to be paid on a particular class of imports or exports', 'definition': 'A tax or duty to be paid on a particular class of imports or exports.' },
        { 'word': 'embargo', 'syllables': 'em-bar-go', 'hint': 'An official ban on trade with a particular country', 'definition': 'An official ban on trade or other commercial activity with a particular country.' },
        { 'word': 'referendum', 'syllables': 'ref-er-en-dum', 'hint': 'A general vote by the electorate on a single political question', 'definition': 'A general vote by the electorate on a single political question which has been referred to them for a direct decision.' },
        { 'word': 'constituency', 'syllables': 'con-stit-u-en-cy', 'hint': 'A body of voters in a specified area who elect a representative', 'definition': 'A body of voters in a specified area who elect a representative to a legislative body.' },
        { 'word': 'electorate', 'syllables': 'e-lec-tor-ate', 'hint': 'All the people in a country or area who are entitled to vote', 'definition': 'All the people in a country or area who are entitled to vote in an election.' },
        { 'word': 'inauguration', 'syllables': 'in-au-gu-ra-tion', 'hint': 'The beginning or introduction of a system, policy, or period', 'definition': 'The beginning or introduction of a system, policy, or period.' },
        { 'word': 'impeachment', 'syllables': 'im-peach-ment', 'hint': 'A charge of misconduct made against the holder of a public office', 'definition': 'A charge of misconduct made against the holder of a public office.' },
        { 'word': 'veto', 'syllables': 've-to', 'hint': 'A constitutional right to reject a decision or proposal', 'definition': 'A constitutional right to reject a decision or proposal made by a law-making body.' },
        { 'word': 'ratify', 'syllables': 'rat-i-fy', 'hint': 'Sign or give formal consent to a treaty or contract', 'definition': 'Sign or give formal consent to (a treaty, contract, or agreement), making it officially valid.' },
        { 'word': 'census', 'syllables': 'cen-sus', 'hint': 'An official count or survey of a population', 'definition': 'An official count or survey of a population, typically recording various details of individuals.' },
        { 'word': 'anarchy', 'syllables': 'an-ar-chy', 'hint': 'A state of disorder due to absence of authority', 'definition': 'A state of disorder due to absence or nonrecognition of authority.' }
      ],
      natureAndGeography: [
        // 75 words
        { word: 'atmosphere', syllables: 'at-mos-phere', hint: 'The envelope of gases surrounding the earth', definition: 'The envelope of gases surrounding the earth or another planet.' },
        { word: 'biosphere', syllables: 'bi-o-sphere', hint: 'The regions of the earth occupied by living organisms', definition: 'The regions of the surface, atmosphere, and hydrosphere of the earth occupied by living organisms.' },
        { word: 'continent', syllables: 'con-ti-nent', hint: 'Any of the world\'s main continuous expanses of land', definition: 'Any of the world\'s main continuous expanses of land (e.g., Africa, Asia, Europe).' },
        { word: 'peninsula', syllables: 'pen-in-su-la', hint: 'A piece of land almost surrounded by water', definition: 'A piece of land almost surrounded by water or projecting out into a body of water.' },
        { word: 'archipelago', syllables: 'ar-chi-pel-a-go', hint: 'A group of islands', definition: 'A group of islands.' },
        { word: 'plateau', syllables: 'pla-teau', hint: 'An area of relatively level high ground', definition: 'An area of relatively level high ground.' },
        { word: 'canyon', syllables: 'can-yon', hint: 'A deep gorge, typically one with a river flowing through it', definition: 'A deep gorge, typically one with a river flowing through it.' },
        { word: 'glacier', syllables: 'gla-cier', hint: 'A slowly moving mass or river of ice', definition: 'A slowly moving mass or river of ice formed by the accumulation and compaction of snow on mountains or near the poles.' },
        { word: 'volcano', syllables: 'vol-ca-no', hint: 'A mountain from which lava and ash flow', definition: 'A mountain or hill, typically conical, having a crater or vent through which lava, rock fragments, hot vapor, and gas are or have been erupted from the earth\'s crust.' },
        { word: 'earthquake', syllables: 'earth-quake', hint: 'A sudden violent shaking of the ground', definition: 'A sudden violent shaking of the ground, typically causing great destruction, as a result of movements within the earth\'s crust or volcanic action.' },
        { word: 'tsunami', syllables: 'tsu-na-mi', hint: 'A long high sea wave caused by an earthquake', definition: 'A long high sea wave caused by an earthquake, submarine landslide, or other disturbance.' },
        { word: 'hurricane', syllables: 'hur-ri-cane', hint: 'A storm with a violent wind, in particular a tropical cyclone', definition: 'A storm with a violent wind, in particular a tropical cyclone in the Caribbean.' },
        { word: 'tornado', syllables: 'tor-na-do', hint: 'A mobile, destructive vortex of violently rotating winds', definition: 'A mobile, destructive vortex of violently rotating winds having the appearance of a funnel-shaped cloud and advancing beneath a large storm system.' },
        { word: 'monsoon', syllables: 'mon-soon', hint: 'A seasonal prevailing wind in the region of South and Southeast Asia', definition: 'A seasonal prevailing wind in the region of South and Southeast Asia, blowing from the southwest between May and September and bringing rain.' },
        { word: 'drought', syllables: 'drought', hint: 'A prolonged period of abnormally low rainfall', definition: 'A prolonged period of abnormally low rainfall, leading to a shortage of water.' },
        { word: 'erosion', syllables: 'e-ro-sion', hint: 'The process of being gradually worn away by wind, water, or other natural agents', definition: 'The process of eroding or being eroded by wind, water, or other natural agents.' },
        { word: 'sediment', syllables: 'sed-i-ment', hint: 'Matter that settles to the bottom of a liquid', definition: 'Matter that settles to the bottom of a liquid; dregs.' },
        { word: 'ecosystem', syllables: 'e-co-sys-tem', hint: 'A biological community of interacting organisms', definition: 'A biological community of interacting organisms and their physical environment.' },
        { word: 'environment', syllables: 'en-vi-ron-ment', hint: 'The surroundings or conditions in which a person, animal, or plant lives', definition: 'The surroundings or conditions in which a person, animal, or plant lives or operates.' },
        { word: 'conservation', syllables: 'con-ser-va-tion', hint: 'Preservation, protection, or restoration of the natural environment', definition: 'Preservation, protection, or restoration of the natural environment and of wildlife.' },
        { word: 'pollution', syllables: 'pol-lu-tion', hint: 'The presence of harmful substances in the environment', definition: 'The presence in or introduction into the environment of a substance or thing that has harmful or poisonous effects.' },
        { word: 'deforestation', syllables: 'de-for-es-ta-tion', hint: 'The clearing of trees, transforming a forest into cleared land', definition: 'The clearing of a wide area of trees.' },
        { word: 'extinction', syllables: 'ex-tinc-tion', hint: 'The state or process of a species, family, or other group of animals or plants ceasing to exist', definition: 'The state or process of a species, family, or other group of animals or plants no longer having any living members.' },
        { 'word': 'biodiversity', 'syllables': 'bi-o-di-ver-si-ty', 'hint': 'The variety of life in the world or in a particular habitat or ecosystem', 'definition': 'The variety of life in the world or in a particular habitat or ecosystem.' },
        { 'word': 'photosynthesis', 'syllables': 'pho-to-syn-the-sis', 'hint': 'The process by which green plants use sunlight to synthesize foods', 'definition': 'The process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll pigment.' },
        { 'word': 'respiration', 'syllables': 'res-pi-ra-tion', 'hint': 'The action of breathing', 'definition': 'The action of breathing.' },
        { 'word': 'transpiration', 'syllables': 'tran-spi-ra-tion', 'hint': 'The process where plants absorb water through the roots and then give off water vapor', 'definition': 'The process where plants absorb water through the roots and then give off water vapor from pores in their leaves.' },
        { 'word': 'germination', 'syllables': 'ger-mi-na-tion', 'hint': 'The development of a plant from a seed or spore', 'definition': 'The development of a plant from a seed or spore after a period of dormancy.' },
        { 'word': 'pollination', 'syllables': 'pol-li-na-tion', 'hint': 'The transfer of pollen to a stigma, ovule, flower, or plant to allow fertilization', 'definition': 'The transfer of pollen to a stigma, ovule, flower, or plant to allow fertilization.' },
        { 'word': 'adaptation', 'syllables': 'ad-ap-ta-tion', 'hint': 'The process of change by which an organism becomes better suited to its environment', 'definition': 'The process of change by which an organism or species becomes better suited to its environment.' },
        { 'word': 'hibernation', 'syllables': 'hi-ber-na-tion', 'hint': 'The condition or period of an animal or plant spending the winter in a dormant state', 'definition': 'The condition or period of an animal or plant spending the winter in a dormant state.' },
        { 'word': 'metamorphosis', 'syllables': 'met-a-mor-pho-sis', 'hint': 'The process of transformation from an immature form to an adult form', 'definition': 'The process of transformation from an immature form to an adult form in two or more distinct stages.' },
        { 'word': 'symbiosis', 'syllables': 'sym-bi-o-sis', 'hint': 'Interaction between two different organisms living in close physical association', 'definition': 'Interaction between two different organisms living in close physical association, typically to the advantage of both.' },
        { 'word': 'parasite', 'syllables': 'par-a-site', 'hint': 'An organism that lives in or on another organism (its host)', 'definition': 'An organism that lives in or on another organism (its host) and benefits by deriving nutrients at the host\'s expense.' },
        { 'word': 'camouflage', 'syllables': 'cam-ou-flage', 'hint': 'The disguising of military personnel, equipment, and installations by painting or covering them', 'definition': 'The disguising of military personnel, equipment, and installations by painting or covering them to make them blend in with their surroundings.' },
        { 'word': 'nocturnal', 'syllables': 'noc-tur-nal', 'hint': 'Done, occurring, or active at night', 'definition': 'Done, occurring, or active at night.' },
        { 'word': 'diurnal', 'syllables': 'di-ur-nal', 'hint': 'Of or during the day', 'definition': 'Of or during the day.' },
        { 'word': 'herbivore', 'syllables': 'her-bi-vore', 'hint': 'An animal that feeds on plants', 'definition': 'An animal that feeds on plants.' },
        { 'word': 'carnivore', 'syllables': 'car-ni-vore', 'hint': 'An animal that feeds on flesh', 'definition': 'An animal that feeds on flesh.' },
        { 'word': 'omnivore', 'syllables': 'om-ni-vore', 'hint': 'An animal or person that eats food of both plant and animal origin', 'definition': 'An animal or person that eats food of both plant and animal origin.' },
        { 'word': 'topography', 'syllables': 'to-pog-ra-phy', 'hint': 'The arrangement of the natural and artificial physical features of an area', 'definition': 'The arrangement of the natural and artificial physical features of an area.' },
        { 'word': 'cartography', 'syllables': 'car-tog-ra-phy', 'hint': 'The science or practice of drawing maps', 'definition': 'The science or practice of drawing maps.' },
        { 'word': 'hemisphere', 'syllables': 'hem-i-sphere', 'hint': 'A half of the earth', 'definition': 'A half of the earth, usually as divided into northern and southern halves by the equator.' },
        { 'word': 'equator', 'syllables': 'e-qua-tor', 'hint': 'An imaginary line around the middle of the earth', 'definition': 'An imaginary line drawn on the earth equally distant from both poles, dividing the earth into northern and southern hemispheres.' },
        { 'word': 'latitude', 'syllables': 'lat-i-tude', 'hint': 'The angular distance of a place north or south of the earth\'s equator', 'definition': 'The angular distance of a place north or south of the earth\'s equator, or of a celestial object north or south of the celestial equator, usually expressed in degrees and minutes.' },
        { 'word': 'longitude', 'syllables': 'lon-gi-tude', 'hint': 'The angular distance of a place east or west of the Greenwich meridian', 'definition': 'The angular distance of a place east or west of the meridian at Greenwich, England, or west of the standard meridian of a celestial object, usually expressed in degrees and minutes.' },
        { 'word': 'meridian', 'syllables': 'me-rid-i-an', 'hint': 'A circle of constant longitude passing through a given place on the earth\'s surface', 'definition': 'A circle of constant longitude passing through a given place on the earth\'s surface and the terrestrial poles.' },
        { 'word': 'altitude', 'syllables': 'al-ti-tude', 'hint': 'The height of an object or point in relation to sea level or ground level', 'definition': 'The height of an object or point in relation to sea level or ground level.' },
        { 'word': 'delta', 'syllables': 'del-ta', 'hint': 'A triangular tract of sediment deposited at the mouth of a river', 'definition': 'A triangular tract of sediment deposited at the mouth of a river, typically where it diverges into several outlets.' },
        { 'word': 'estuary', 'syllables': 'es-tu-ar-y', 'hint': 'The tidal mouth of a large river, where the tide meets the stream', 'definition': 'The tidal mouth of a large river, where the tide meets the stream.' },
        { 'word': 'tributary', 'syllables': 'trib-u-tar-y', 'hint': 'A river or stream flowing into a larger river or lake', 'definition': 'A river or stream flowing into a larger river or lake.' },
        { 'word': 'peninsula', 'syllables': 'pen-in-su-la', 'hint': 'A piece of land almost surrounded by water', 'definition': 'A piece of land almost surrounded by water or projecting out into a body of water.' },
        { 'word': 'isthmus', 'syllables': 'isth-mus', 'hint': 'A narrow strip of land with sea on either side', 'definition': 'A narrow strip of land with sea on either side, forming a link between two larger areas of land.' },
        { 'word': 'strait', 'syllables': 'strait', 'hint': 'A narrow passage of water connecting two seas', 'definition': 'A narrow passage of water connecting two seas or two other large areas of water.' },
        { 'word': 'savanna', 'syllables': 'sa-van-na', 'hint': 'A grassy plain in tropical or subtropical regions', 'definition': 'A grassy plain in tropical or subtropical regions, with few trees.' },
        { 'word': 'tundra', 'syllables': 'tun-dra', 'hint': 'A vast, flat, treeless Arctic region', 'definition': 'A vast, flat, treeless Arctic region in which the subsoil is permanently frozen.' },
        { 'word': 'taiga', 'syllables': 'tai-ga', 'hint': 'The sometimes swampy coniferous forest of high northern latitudes', 'definition': 'The sometimes swampy coniferous forest of high northern latitudes, especially that between the tundra and steppes of Siberia and North America.' },
        { 'word': 'steppe', 'syllables': 'steppe', 'hint': 'A large area of flat unforested grassland in southeastern Europe or Siberia', 'definition': 'A large area of flat unforested grassland in southeastern Europe or Siberia.' },
        { 'word': 'pampas', 'syllables': 'pam-pas', 'hint': 'Extensive, treeless plains in South America', 'definition': 'Extensive, treeless plains in South America.' },
        { 'word': 'prairie', 'syllables': 'prai-rie', 'hint': 'A large open area of grassland, especially in North America', 'definition': 'A large open area of grassland, especially in the Mississippi River valley.' },
        { 'word': 'canopy', 'syllables': 'can-o-py', 'hint': 'The uppermost branches of the trees in a forest', 'definition': 'The uppermost branches of the trees in a forest, forming a more or less continuous layer of foliage.' },
        { 'word': 'undergrowth', 'syllables': 'un-der-growth', 'hint': 'A dense growth of shrubs and other low plants', 'definition': 'A dense growth of shrubs and other low plants, especially under trees in woodland.' },
        { 'word': 'foliage', 'syllables': 'fo-li-age', 'hint': 'Plant leaves, collectively', 'definition': 'Plant leaves, collectively.' },
        { 'word': 'deciduous', 'syllables': 'de-cid-u-ous', 'hint': 'Shedding its leaves annually', 'definition': '(of a tree or shrub) shedding its leaves annually.' },
        { 'word': 'evergreen', 'syllables': 'ev-er-green', 'hint': 'Retaining green leaves throughout the year', 'definition': 'A plant that retains green leaves throughout the year.' },
        { 'word': 'coniferous', 'syllables': 'co-nif-er-ous', 'hint': 'Of or relating to or part of trees that bear cones', 'definition': 'Of or relating to or part of trees or shrubs of a phylum of gymnosperms that are mostly evergreen and bear cones.' },
        { 'word': 'terrain', 'syllables': 'ter-rain', 'hint': 'A stretch of land, especially with regard to its physical features', 'definition': 'A stretch of land, especially with regard to its physical features.' },
        { 'word': 'geyser', 'syllables': 'gey-ser', 'hint': 'A hot spring in which water intermittently boils', 'definition': 'A hot spring in which water intermittently boils, sending a tall column of water and steam into the air.' },
        { 'word': 'lagoon', 'syllables': 'la-goon', 'hint': 'A stretch of salt water separated from the sea by a low sandbank', 'definition': 'A stretch of salt water separated from the sea by a low sandbank or coral reef.' },
        { 'word': 'fjord', 'syllables': 'fjord', 'hint': 'A long, narrow, deep inlet of the sea between high cliffs', 'definition': 'A long, narrow, deep inlet of the sea between high cliffs, as in Norway and Iceland, typically formed by submergence of a glaciated valley.' },
        { 'word': 'avalanche', 'syllables': 'av-a-lanche', 'hint': 'A mass of snow, ice, and rocks falling rapidly down a mountainside', 'definition': 'A mass of snow, ice, and rocks falling rapidly down a mountainside.' },
        { 'word': 'landslide', 'syllables': 'land-slide', 'hint': 'The sliding down of a mass of earth or rock from a mountain or cliff', 'definition': 'The sliding down of a mass of earth or rock from a mountain or cliff.' },
        { 'word': 'equinox', 'syllables': 'e-qui-nox', 'hint': 'The time when the sun crosses the celestial equator', 'definition': 'The time or date (twice each year) at which the sun crosses the celestial equator, when day and night are of equal length.' }
      ],
      academicLanguage: [
        // 75 words
        { word: 'analysis', syllables: 'a-nal-y-sis', hint: 'Detailed examination of something', definition: 'Detailed examination of the elements or structure of something.' },
        { word: 'approach', syllables: 'ap-proach', hint: 'A way of dealing with something', definition: 'A way of dealing with a situation or problem.' },
        { word: 'assessment', syllables: 'as-sess-ment', hint: 'The evaluation of the quality of something', definition: 'The evaluation or estimation of the nature, quality, or ability of someone or something.' },
        { word: 'assumption', syllables: 'as-sump-tion', hint: 'A thing that is accepted as true without proof', definition: 'A thing that is accepted as true or as certain to happen, without proof.' },
        { word: 'chronological', syllables: 'chron-o-log-i-cal', hint: 'Following the order in which they occurred', definition: '(of a record of events) starting with the earliest and following the order in which they occurred.' },
        { word: 'classification', syllables: 'clas-si-fi-ca-tion', hint: 'The arrangement of things in groups', definition: 'The arrangement of animals or plants in taxonomic groups according to their observed similarities.' },
        { word: 'cohesion', syllables: 'co-he-sion', hint: 'The action of forming a united whole', definition: 'The action or fact of forming a united whole.' },
        { word: 'collaboration', syllables: 'col-lab-o-ra-tion', hint: 'The action of working with someone to create something', definition: 'The action of working with someone to produce or create something.' },
        { word: 'component', syllables: 'com-po-nent', hint: 'A part of a larger whole', definition: 'A part or element of a larger whole, especially a part of a machine or vehicle.' },
        { word: 'conclusion', syllables: 'con-clu-sion', hint: 'A judgment reached by reasoning', definition: 'A judgment or decision reached by reasoning.' },
        { word: 'consequence', syllables: 'con-se-quence', hint: 'A result or effect of an action', definition: 'A result or effect of an action or condition.' },
        { word: 'consistency', syllables: 'con-sis-ten-cy', hint: 'Agreement or harmony of parts', definition: 'Conformity in the application of something, typically that which is necessary for the sake of logic, accuracy, or fairness.' },
        { word: 'constitute', syllables: 'con-sti-tute', hint: 'To be a part of a whole', definition: 'Be (a part) of a whole.' },
        { word: 'context', syllables: 'con-text', hint: 'The circumstances that form the setting for an event', definition: 'The circumstances that form the setting for an event, statement, or idea, and in terms of which it can be fully understood and assessed.' },
        { word: 'criterion', syllables: 'cri-te-ri-on', hint: 'A principle or standard by which something may be judged', definition: 'A principle or standard by which something may be judged or decided.' },
        { word: 'deduction', syllables: 'de-duc-tion', hint: 'The inference of particular instances by reference to a general law', definition: 'The inference of particular instances by reference to a general law or principle.' },
        { word: 'definition', syllables: 'def-i-ni-tion', hint: 'A statement of the exact meaning of a word', definition: 'A statement of the exact meaning of a word, especially in a dictionary.' },
        { word: 'demonstrate', syllables: 'dem-on-strate', hint: 'To give a practical exhibition and explanation of something', definition: 'Clearly show the existence or truth of (something) by giving proof or evidence.' },
        { word: 'derivation', syllables: 'der-i-va-tion', hint: 'The obtaining or developing of something from a source', definition: 'The action of obtaining something from a source.' },
        { word: 'distribution', syllables: 'dis-tri-bu-tion', hint: 'The way in which something is shared out among a group', definition: 'The action of sharing something out among a number of recipients.' },
        { word: 'eloquence', syllables: 'el-o-quence', hint: 'Fluent or persuasive speaking or writing', definition: 'Fluent or persuasive speaking or writing.' },
        { word: 'emphasis', syllables: 'em-pha-sis', hint: 'Special importance or value given to something', definition: 'Special importance, value, or prominence given to something.' },
        { word: 'empirical', syllables: 'em-pir-i-cal', hint: 'Based on observation or experience rather than theory', definition: 'Based on, concerned with, or verifiable by observation or experience rather than theory or pure logic.' },
        { word: 'equation', syllables: 'e-qua-tion', hint: 'A statement that the values of two mathematical expressions are equal', definition: 'A statement that the values of two mathematical expressions are equal (indicated by the sign =).' },
        { word: 'evaluation', syllables: 'e-val-u-a-tion', hint: 'The making of a judgment about the amount or value of something', definition: 'The making of a judgment about the amount, number, or value of something; assessment.' },
        { word: 'evidence', syllables: 'ev-i-dence', hint: 'The available body of facts indicating whether a belief is true', definition: 'The available body of facts or information indicating whether a belief or proposition is true or valid.' },
        { word: 'exclusion', syllables: 'ex-clu-sion', hint: 'The process of preventing someone from a place', definition: 'The process or state of excluding or being excluded.' },
        { word: 'expository', syllables: 'ex-pos-i-to-ry', hint: 'Intended to explain or describe something', definition: 'Intended to explain or describe something.' },
        { word: 'framework', syllables: 'frame-work', hint: 'A basic structure underlying a system or concept', definition: 'A basic structure underlying a system, concept, or text.' },
        { word: 'function', syllables: 'func-tion', hint: 'An activity that is natural to a person or thing', definition: 'An activity or purpose natural to or intended for a person or thing.' },
        { word: 'hypothesis', syllables: 'hy-poth-e-sis', hint: 'A supposition or proposed explanation', definition: 'A supposition or proposed explanation made on the basis of limited evidence as a starting point for further investigation.' },
        { word: 'identification', syllables: 'i-den-ti-fi-ca-tion', hint: 'The action of recognizing or establishing something', definition: 'The action or process of identifying someone or something or the fact of being identified.' },
        { word: 'implication', syllables: 'im-pli-ca-tion', hint: 'The conclusion that can be drawn from something', definition: 'The conclusion that can be drawn from something although it is not explicitly stated.' },
        { word: 'indicate', syllables: 'in-di-cate', hint: 'To point out or show', definition: 'Point out; show.' },
        { word: 'individual', syllables: 'in-di-vid-u-al', hint: 'A single human being', definition: 'A single human being as distinct from a group, class, or family.' },
        { word: 'interpretation', syllables: 'in-ter-pre-ta-tion', hint: 'The action of explaining the meaning of something', definition: 'The action of explaining the meaning of something.' },
        { word: 'involvement', syllables: 'in-volve-ment', hint: 'The fact or condition of being involved with something', definition: 'The fact or condition of being involved with or participating in something.' },
        { word: 'issue', syllables: 'is-sue', hint: 'An important topic or problem for debate', definition: 'An important topic or problem for debate or discussion.' },
        { word: 'labor', syllables: 'la-bor', hint: 'Work, especially hard physical work', definition: 'Work, especially hard physical work.' },
        { word: 'legal', syllables: 'le-gal', hint: 'Relating to the law', definition: 'Of, based on, or concerned with the law.' },
        { word: 'legislation', syllables: 'leg-is-la-tion', hint: 'Laws, considered collectively', definition: 'Laws, considered collectively.' },
        { word: 'major', syllables: 'ma-jor', hint: 'Important, serious, or significant', definition: 'Important, serious, or significant.' },
        { word: 'method', syllables: 'meth-od', hint: 'A procedure for accomplishing something', definition: 'A particular form of procedure for accomplishing or approaching something.' },
        { word: 'minority', syllables: 'mi-nor-i-ty', hint: 'The smaller number or part', definition: 'The smaller number or part, especially a number that is less than half the whole number.' },
        { word: 'negative', syllables: 'neg-a-tive', hint: 'Consisting in or characterized by the absence of features', definition: 'A word or statement that expresses denial, disagreement, or refusal.' },
        { word: 'normal', syllables: 'nor-mal', hint: 'Conforming to a standard; usual', definition: 'Conforming to a standard; usual, typical, or expected.' },
        { word: 'objective', syllables: 'ob-jec-tive', hint: 'A thing aimed at or sought; a goal', definition: 'A thing aimed at or sought; a goal.' },
        { word: 'occurrence', syllables: 'oc-cur-rence', hint: 'An incident or event', definition: 'An incident or event.' },
        { word: 'percent', syllables: 'per-cent', hint: 'By a specified amount in or for every hundred', definition: 'By a specified amount in or for every hundred.' },
        { word: 'period', syllables: 'pe-ri-od', hint: 'A length or portion of time', definition: 'A length or portion of time.' },
        { word: 'policy', syllables: 'pol-i-cy', hint: 'A course of action adopted by a government or individual', definition: 'A course or principle of action adopted or proposed by a government, party, business, or individual.' },
        { word: 'positive', syllables: 'pos-i-tive', hint: 'Consisting in or characterized by the presence of features', definition: 'Constructive, optimistic, or confident.' },
        { word: 'potential', syllables: 'po-ten-tial', hint: 'Having the capacity to develop into something in the future', definition: 'Having or showing the capacity to become or develop into something in the future.' },
        { word: 'previous', syllables: 'pre-vi-ous', hint: 'Existing or occurring before in time or order', definition: 'Existing or occurring before in time or order.' },
        { word: 'primary', syllables: 'pri-ma-ry', hint: 'Of chief importance; principal', definition: 'Of chief importance; principal.' },
        { word: 'principle', syllables: 'prin-ci-ple', hint: 'A fundamental truth that serves as a foundation', definition: 'A fundamental truth or proposition that serves as the foundation for a system of belief or behavior.' },
        { word: 'procedure', syllables: 'pro-ce-dure', hint: 'An established way of doing something', definition: 'An established or official way of doing something.' },
        { word: 'process', syllables: 'pro-cess', hint: 'A series of actions taken to achieve an end', definition: 'A series of actions or steps taken in order to achieve a particular end.' },
        { word: 'publication', syllables: 'pub-li-ca-tion', hint: 'A book or journal issued for public sale', definition: 'A book, journal, or other text that is printed and distributed to the public.' },
        { word: 'range', syllables: 'range', hint: 'The area of variation between upper and lower limits', definition: 'The area of variation between upper and lower limits on a particular scale.' },
        { word: 'region', syllables: 're-gion', hint: 'An area with definable characteristics', definition: 'An area or division, especially part of a country or the world having definable characteristics but not always fixed boundaries.' },
        { word: 'regulation', syllables: 'reg-u-la-tion', hint: 'A rule made and maintained by an authority', definition: 'A rule or directive made and maintained by an authority.' },
        { word: 'relevant', syllables: 'rel-e-vant', hint: 'Closely connected to what is being done', definition: 'Closely connected or appropriate to what is being done or considered.' },
        { word: 'required', syllables: 're-quired', hint: 'Officially compulsory, or otherwise considered essential', definition: 'Officially compulsory, or otherwise considered essential; indispensable.' },
        { word: 'research', syllables: 're-search', hint: 'Investigation to establish facts and reach conclusions', definition: 'The systematic investigation into and study of materials and sources in order to establish facts and reach new conclusions.' },
        { word: 'resource', syllables: 're-source', hint: 'A stock or supply of materials or assets', definition: 'A stock or supply of money, materials, staff, and other assets that can be drawn on by a person or organization.' },
        { word: 'response', syllables: 're-sponse', hint: 'A verbal or written answer', definition: 'A verbal or written answer.' },
        { word: 'role', syllables: 'role', hint: 'The function assumed by a person or thing', definition: 'The function assumed or part played by a person or thing in a particular situation.' },
        { word: 'section', syllables: 'sec-tion', hint: 'Any of the distinct parts into which something is divided', definition: 'Any of the more or less distinct parts into which something is or may be divided or from which it is made up.' },
        { word: 'sector', syllables: 'sec-tor', hint: 'An area or portion that is distinct from others', definition: 'An area or portion that is distinct from others.' },
        { word: 'significant', syllables: 'sig-nif-i-cant', hint: 'Sufficiently great or important to be worthy of attention', definition: 'Sufficiently great or important to be worthy of attention; noteworthy.' },
        { word: 'similar', syllables: 'sim-i-lar', hint: 'Resembling without being identical', definition: 'Resembling without being identical.' },
        { word: 'source', syllables: 'source', hint: 'A place, person, or thing from which something comes', definition: 'A place, person, or thing from which something comes or can be obtained.' },
        { word: 'specific', syllables: 'spe-cif-ic', hint: 'Clearly defined or identified', definition: 'Clearly defined or identified.' },
        { word: 'strategy', syllables: 'strat-e-gy', hint: 'A plan of action designed to achieve a major aim', definition: 'A plan of action or policy designed to achieve a major or overall aim.' }
      ],
    },
    hard: {
      generalVocabulary: [
        { word: 'ubiquitous', syllables: 'u-biq-ui-tous', hint: 'Seeming to be everywhere at once', definition: 'Present, appearing, or found everywhere.' },
        { word: 'benevolent', syllables: 'be-nev-o-lent', hint: 'Kind and well-meaning', definition: 'Characterized by or expressing goodwill or kindly feelings.' },
        { word: 'ambiguous', syllables: 'am-big-u-ous', hint: 'Having more than one possible meaning', definition: 'Open to more than one interpretation; not having one obvious meaning.' },
        { word: 'conscientious', syllables: 'con-sci-en-tious', hint: 'Wishing to do what is right, especially one\'s work', definition: 'Characterized by extreme care and great effort.' },
        { word: 'meticulous', syllables: 'me-tic-u-lous', hint: 'Showing great attention to detail; very careful', definition: 'Taking or showing extreme care about minute details; precise; thorough.' },
        { word: 'tenacious', syllables: 'te-na-cious', hint: 'Not easily letting go or giving up', definition: 'Tending to keep a firm hold of something; clinging or adhering closely.' },
        { word: 'resilient', syllables: 're-sil-ient', hint: 'Able to bounce back quickly from difficulties', definition: 'Able to withstand or recover quickly from difficult conditions.' },
        { word: 'ostentatious', syllables: 'os-ten-ta-tious', hint: 'Designed to impress or attract notice; showy', definition: 'Characterized by vulgar or pretentious display; designed to impress.' },
        { word: 'precarious', syllables: 'pre-car-i-ous', hint: 'Not securely held; dangerously likely to fall', definition: 'Dependent on chance; uncertain; dependent on circumstances beyond one\'s control.' },
        { word: 'clandestine', syllables: 'clan-des-tine', hint: 'Kept secret or done secretively', definition: 'Characterized by, done in, or executed with secrecy or concealment.' },
        { word: 'gregarious', syllables: 'gre-gar-i-ous', hint: 'Fond of company; sociable', definition: '(Of a person) fond of company; sociable.' },
        { word: 'ephemeral', syllables: 'e-phem-er-al', hint: 'Lasting for a very short time', definition: 'Lasting a very short time; short-lived; transitory.' },
        { word: 'lethargic', syllables: 'le-thar-gic', hint: 'Sluggish and apathetic; lacking energy', definition: 'Affected by lethargy; sluggish and apathetic.' },
        { word: 'superfluous', syllables: 'su-per-flu-ous', hint: 'More than what is needed or necessary', definition: 'Unnecessary, especially through being more than enough.' },
        { word: 'quintessential', syllables: 'quin-tes-sen-tial', hint: 'The most perfect or typical example of something', definition: 'Representing the most perfect or typical example of a quality or class.' },
        { word: 'egregious', syllables: 'e-gre-gious', hint: 'Outstandingly bad; shocking', definition: 'Extraordinary in some bad way; glaring; flagrant.' },
        { word: 'fastidious', syllables: 'fas-tid-i-ous', hint: 'Very attentive to and concerned about accuracy and detail', definition: 'Excessively particular, critical, or demanding; hard to please.' },
        { word: 'idiosyncratic', syllables: 'id-i-o-syn-crat-ic', hint: 'Peculiar or individual to one person', definition: 'Pertaining to the nature of idiosyncrasy, or something peculiar to an individual.' },
        { word: 'malevolent', syllables: 'ma-lev-o-lent', hint: 'Having a wish to do evil to others', definition: 'Having or showing a wish to do evil to others.' },
        { word: 'anachronism', syllables: 'a-nach-ro-nism', hint: 'Something belonging to a period other than the one it exists in', definition: 'A thing belonging or appropriate to a period other than that in which it exists.' }
      ],
      scienceAndTechnology: [
        { word: 'thermodynamics', syllables: 'ther-mo-dy-nam-ics', hint: 'Branch of physics dealing with heat and energy', definition: 'The branch of physical science that deals with the relations between heat and other forms of energy.' },
        { word: 'electromagnetism', syllables: 'e-lec-tro-mag-net-ism', hint: 'Physics of electricity and magnetism', definition: 'The phenomena associated with electric and magnetic fields and their interactions.' },
        { word: 'nanotechnology', syllables: 'na-no-tech-nol-o-gy', hint: 'Technology on a microscopic scale', definition: 'The branch of technology that deals with dimensions and tolerances of less than 100 nanometers.' },
        { word: 'biomechanics', syllables: 'bi-o-me-chan-ics', hint: 'The study of the mechanical laws relating to living organisms', definition: 'The study of the mechanical laws relating to the movement or structure of living organisms.' },
        { word: 'astrophysics', syllables: 'as-tro-phys-ics', hint: 'Physics of the universe, including stars and galaxies', definition: 'The branch of astronomy concerned with the physical nature of stars and other celestial bodies.' },
        { word: 'cryptography', syllables: 'cryp-tog-ra-phy', hint: 'The art of writing or solving codes', definition: 'The art of writing or solving codes.' },
        { word: 'paradigm', syllables: 'par-a-digm', hint: 'A typical example or model of something', definition: 'A typical example or pattern of something; a model.' },
        { word: 'synthesis', syllables: 'syn-the-sis', hint: 'Combining parts to form a complex whole', definition: 'The combination of ideas to form a theory or system.' },
        { word: 'catalyst', syllables: 'cat-a-lyst', hint: 'A substance that increases the rate of a chemical reaction', definition: 'A substance that increases the rate of a chemical reaction without itself undergoing any permanent chemical change.' },
        { word: 'geothermal', syllables: 'ge-o-ther-mal', hint: 'Relating to the internal heat of the earth', definition: 'Relating to or produced by the internal heat of the earth.' },
        { word: 'hydroelectric', syllables: 'hy-dro-e-lec-tric', hint: 'Generating electricity using flowing water', definition: 'Relating to or denoting the generation of electricity using flowing water to drive a turbine.' },
        { word: 'semiconductor', syllables: 'sem-i-con-duc-tor', hint: 'A solid with conductivity between an insulator and a conductor', definition: 'A solid substance that has a conductivity between that of an insulator and that of most metals.' },
        { word: 'repository', syllables: 're-pos-i-to-ry', hint: 'A place where things are stored', definition: 'A place, building, or receptacle where things are or may be stored.' },
        { word: 'peripheral', syllables: 'pe-riph-er-al', hint: 'A device connected to a computer, like a keyboard or mouse', definition: 'An ancillary device used to put information into and get information out of the computer.' },
        { word: 'bandwidth', syllables: 'band-width', hint: 'The maximum rate of data transfer across a network', definition: 'The range of frequencies within a given band, in particular that used for transmitting a signal.' },
        { word: 'encryption', syllables: 'en-cryp-tion', hint: 'The process of converting information into a code', definition: 'The process of converting information or data into a code, especially to prevent unauthorized access.' },
        { word: 'virtualization', syllables: 'vir-tu-al-i-za-tion', hint: 'Creating a virtual version of something, like an operating system', definition: 'The creation of a virtual (rather than actual) version of something, such as an operating system or server.' },
        { word: 'quantum', syllables: 'quan-tum', hint: 'A discrete quantity of energy in physics', definition: 'A discrete quantity of energy proportional in magnitude to the frequency of the radiation it represents.' },
        { word: 'symbiotic', syllables: 'sym-bi-ot-ic', hint: 'A mutually beneficial relationship between different organisms', definition: 'Involving interaction between two different organisms living in close physical association.' },
        { word: 'algorithm', syllables: 'al-go-rithm', hint: 'A process or set of rules to be followed in calculations', definition: 'A process or set of rules to be followed in calculations or other problem-solving operations.' }
      ],
      literatureAndArts: [
        { word: 'juxtaposition', syllables: 'jux-ta-po-si-tion', hint: 'Placing two things together for contrasting effect', definition: 'The fact of two things being seen or placed close together with contrasting effect.' },
        { word: 'verisimilitude', syllables: 'ver-i-si-mil-i-tude', hint: 'The appearance of being true or real', definition: 'The appearance of being true or real.' },
        { word: 'catharsis', syllables: 'ca-thar-sis', hint: 'Releasing strong or repressed emotions', definition: 'The process of releasing, and thereby providing relief from, strong or repressed emotions.' },
        { word: 'hubris', syllables: 'hu-bris', hint: 'Excessive pride or self-confidence', definition: 'Excessive pride or self-confidence.' },
        { word: 'euphemism', syllables: 'eu-phe-mism', hint: 'A mild word substituted for one considered too harsh', definition: 'A mild or indirect word or expression substituted for one considered to be too harsh or blunt.' },
        { word: 'oxymoron', syllables: 'ox-y-mo-ron', hint: 'A figure of speech with contradictory terms', definition: 'A figure of speech in which apparently contradictory terms appear in conjunction (e.g., deafening silence).' },
        { word: 'paradox', syllables: 'par-a-dox', hint: 'A seemingly absurd statement that may be true', definition: 'A seemingly absurd or self-contradictory statement or proposition that when investigated may prove to be well founded or true.' },
        { word: 'dissonance', syllables: 'dis-so-nance', hint: 'A lack of harmony among musical notes', definition: 'Lack of harmony among musical notes.' },
        { word: 'virtuoso', syllables: 'vir-tu-o-so', hint: 'A person highly skilled in an artistic pursuit', definition: 'A person highly skilled in music or another artistic pursuit.' },
        { word: 'crescendo', syllables: 'cre-scen-do', hint: 'A gradual increase in loudness in music', definition: 'The loudest point reached in a gradually increasing sound.' },
        { word: 'chiaroscuro', syllables: 'chi-a-ro-scu-ro', hint: 'The treatment of light and shade in drawing and painting', definition: 'The treatment of light and shade in drawing and painting.' },
        { word: 'motif', syllables: 'mo-tif', hint: 'A recurring element that has symbolic significance', definition: 'A decorative design or pattern.' },
        { word: 'subtext', syllables: 'sub-text', hint: 'An underlying and often unspoken theme', definition: 'An underlying and often distinct theme in a piece of writing or conversation.' },
        { word: 'denouement', syllables: 'de-noue-ment', hint: 'The final part of a play or story, the climax', definition: 'The final part of a play, movie, or narrative in which the strands of the plot are drawn together and matters are explained or resolved.' },
        { word: 'exposition', syllables: 'ex-po-si-tion', hint: 'A comprehensive description and explanation of an idea', definition: 'A comprehensive description and explanation of an idea or theory.' },
        { word: 'anachronism', syllables: 'a-nach-ro-nism', hint: 'Something out of place in terms of time', definition: 'A thing belonging or appropriate to a period other than that in which it exists.' },
        { word: 'pastiche', syllables: 'pas-tiche', hint: 'An artistic work that imitates the style of another', definition: 'An artistic work in a style that imitates that of another work, artist, or period.' },
        { word: 'sonnet', syllables: 'son-net', hint: 'A poem of fourteen lines', definition: 'A poem of fourteen lines using any of a number of formal rhyme schemes, in English typically having ten syllables per line.' },
        { word: 'ode', syllables: 'ode', hint: 'A lyric poem addressing a particular subject', definition: 'A lyric poem in the form of an address to a particular subject, often elevated in style or manner.' },
        { word: 'fresco', syllables: 'fres-co', hint: 'A painting done on wet plaster on a wall', definition: 'A painting done rapidly in watercolor on wet plaster on a wall or ceiling, so that the colors penetrate the plaster.' }
      ],
      historyAndSocialStudies: [
        { word: 'hegemony', syllables: 'he-gem-o-ny', hint: 'Leadership or dominance by one country or social group', definition: 'Leadership or dominance, especially by one country or social group over others.' },
        { word: 'sovereignty', syllables: 'sov-er-eign-ty', hint: 'Supreme power or authority', definition: 'The authority of a state to govern itself or another state.' },
        { word: 'proletariat', syllables: 'pro-le-tar-i-at', hint: 'Working-class people regarded collectively', definition: 'Workers or working-class people, regarded collectively (often used with reference to Marxism).' },
        { word: 'bourgeoisie', syllables: 'bour-geoi-sie', hint: 'The middle class, with materialistic values', definition: 'The middle class, typically with reference to its perceived materialistic values or conventional attitudes.' },
        { word: 'disenfranchise', syllables: 'dis-en-fran-chise', hint: 'To deprive someone of the right to vote', definition: 'Deprive (someone) of the right to vote.' },
        { word: 'subjugate', syllables: 'sub-ju-gate', hint: 'To bring under domination or control', definition: 'Bring under domination or control, especially by conquest.' },
        { word: 'ratification', syllables: 'rat-i-fi-ca-tion', hint: 'The official way to confirm something, usually by vote', definition: 'The action of signing or giving formal consent to a treaty, contract, or agreement, making it officially valid.' },
        { word: 'secession', syllables: 'se-ces-sion', hint: 'The action of withdrawing formally from a federation', definition: 'The action of withdrawing formally from membership of a federation or body, especially a political state.' },
        { word: 'totalitarianism', syllables: 'to-tal-i-tar-i-an-ism', hint: 'A system of government that is centralized and dictatorial', definition: 'A system of government that is centralized and dictatorial and requires complete subservience to the state.' },
        { word: 'demagogue', syllables: 'dem-a-gogue', hint: 'A political leader who seeks support by appealing to popular desires', definition: 'A political leader who seeks support by appealing to the desires and prejudices of ordinary people rather than by using rational argument.' },
        { word: 'oligarchy', syllables: 'ol-i-gar-chy', hint: 'A small group of people having control of a country', definition: 'A small group of people having control of a country, organization, or institution.' },
        { word: 'agrarian', syllables: 'a-grar-i-an', hint: 'Relating to cultivated land or the cultivation of land', definition: 'Relating to cultivated land or the cultivation of land.' },
        { word: 'mercantilism', syllables: 'mer-can-til-ism', hint: 'Belief in the benefits of profitable trading; commercialism', definition: 'The economic theory that trade generates wealth and is stimulated by the accumulation of profitable balances.' },
        { word: 'suffrage', syllables: 'suf-frage', hint: 'The right to vote in political elections', definition: 'The right to vote in political elections.' },
        { word: 'diaspora', syllables: 'di-as-po-ra', hint: 'The dispersion of any people from their original homeland', definition: 'The dispersion of any people from their original homeland.' },
        { word: 'zeitgeist', syllables: 'zeit-geist', hint: 'The defining spirit or mood of a particular period', definition: 'The defining spirit or mood of a particular period of history as shown by the ideas and beliefs of the time.' },
        { word: 'antiquity', syllables: 'an-tiq-ui-ty', hint: 'The ancient past, especially before the Middle Ages', definition: 'The ancient past, especially the period before the Middle Ages.' },
        { word: 'feudal', syllables: 'feu-dal', hint: 'Relating to the medieval social system of land for service', definition: 'According to, resembling, or denoting the system of feudalism.' },
        { word: 'emancipation', syllables: 'e-man-ci-pa-tion', hint: 'The process of being set free from legal or political restrictions', definition: 'The fact or process of being set free from legal, social, or political restrictions; liberation.' },
        { word: 'industrialism', syllables: 'in-dus-tri-al-ism', hint: 'A social system where industry and factories are the basis of a country\'s economy', definition: 'A social or economic system built on manufacturing industries.' }
      ],
      natureAndGeography: [
        { word: 'topography', syllables: 'to-pog-ra-phy', hint: 'The arrangement of the natural and artificial physical features of an area', definition: 'The arrangement of the natural and artificial physical features of an area.' },
        { word: 'cartography', syllables: 'car-tog-ra-phy', hint: 'The science or practice of drawing maps', definition: 'The science or practice of drawing maps.' },
        { word: 'subterranean', syllables: 'sub-ter-ra-ne-an', hint: 'Existing, occurring, or done under the earth\'s surface', definition: 'Existing, occurring, or done under the earth\'s surface.' },
        { word: 'archipelago', syllables: 'ar-chi-pel-a-go', hint: 'A group or chain of islands', definition: 'A group of islands.' },
        { word: 'tectonic', syllables: 'tec-ton-ic', hint: 'Relating to the structure of the earth\'s crust', definition: 'Relating to the structure of the earth\'s crust and the large-scale processes which take place within it.' },
        { word: 'stratosphere', syllables: 'strat-o-sphere', hint: 'The layer of the earth\'s atmosphere above the troposphere', definition: 'The layer of the earth\'s atmosphere above the troposphere, extending to about 32 miles (50 km) above the earth\'s surface.' },
        { word: 'biodiversity', syllables: 'bi-o-di-ver-si-ty', hint: 'The variety of life in a particular habitat or ecosystem', definition: 'The variety of life in the world or in a particular habitat or ecosystem.' },
        { word: 'deciduous', syllables: 'de-cid-u-ous', hint: '(Of a tree) shedding its leaves annually', definition: '(of a tree or shrub) shedding its leaves annually.' },
        { word: 'coniferous', syllables: 'co-nif-er-ous', hint: 'Trees that bear cones and needle-like leaves', definition: 'Relating to or denoting trees or shrubs of a phylum of gymnosperms that are mostly evergreen and bear cones.' },
        { word: 'estuary', syllables: 'es-tu-ar-y', hint: 'The tidal mouth of a large river, where the tide meets the stream', definition: 'The tidal mouth of a large river, where the tide meets the stream.' },
        { word: 'perennial', syllables: 'pe-ren-ni-al', hint: 'A plant that lives for more than two years', definition: 'Lasting or existing for a long or apparently infinite time; enduring or continually recurring.' },
        { word: 'bioluminescence', syllables: 'bi-o-lu-mi-nes-cence', hint: 'The production of light by a living organism', definition: 'The biochemical emission of light by living organisms such as fireflies and deep-sea fish.' },
        { word: 'continental', syllables: 'con-ti-nen-tal', hint: 'Forming or belonging to a continent', definition: 'Forming or belonging to a continent.' },
        { word: 'seismic', syllables: 'seis-mic', hint: 'Relating to earthquakes or other vibrations of the earth', definition: 'Relating to earthquakes or other vibrations of the earth and its crust.' },
        { word: 'volcanic', syllables: 'vol-can-ic', hint: 'Relating to or produced by a volcano', definition: 'Originating from a volcano.' },
        { word: 'troposphere', syllables: 'tro-po-sphere', hint: 'The lowest region of the atmosphere', definition: 'The lowest region of the atmosphere, extending from the earth\'s surface to a height of about 3.7–6.2 miles (6–10 km).'},
        { word: 'ephemeral', syllables: 'e-phem-er-al', hint: 'Lasting for a very short time, like some desert flowers', definition: 'Lasting for a very short time.'},
        { word: 'topographical', syllables: 'to-po-graph-i-cal', hint: 'Relating to the arrangement of physical features', definition: 'Relating to the arrangement or accurate representation of the physical features of an area.'},
        { word: 'symbiotic', syllables: 'sym-bi-ot-ic', hint: 'A mutually beneficial relationship between organisms', definition: 'Involving interaction between two different organisms living in close physical association.'},
        { word: 'geothermal', syllables: 'ge-o-ther-mal', hint: 'Heat from the earth', definition: 'Relating to or produced by the internal heat of the earth.'}
      ],
      academicLanguage: [
        { word: 'methodology', syllables: 'meth-od-ol-o-gy', hint: 'A system of methods used in a particular area of study', definition: 'A system of methods used in a particular area of study or activity.' },
        { word: 'pedagogy', syllables: 'ped-a-go-gy', hint: 'The method and practice of teaching', definition: 'The method and practice of teaching, especially as an academic subject or theoretical concept.' },
        { word: 'epistemology', syllables: 'e-pis-te-mol-o-gy', hint: 'The theory of knowledge itself', definition: 'The theory of knowledge, especially with regard to its methods, validity, and scope.' },
        { word: 'ontology', syllables: 'on-tol-o-gy', hint: 'The branch of metaphysics dealing with the nature of being', definition: 'The branch of metaphysics dealing with the nature of being.' },
        { word: 'paradigm', syllables: 'par-a-digm', hint: 'A typical example or pattern of something; a model', definition: 'A typical example or pattern of something; a model.' },
        { word: 'dissertation', syllables: 'dis-ser-ta-tion', hint: 'A long essay on a particular subject, especially for a degree', definition: 'A long essay on a particular subject, especially one written as a requirement for the Doctor of Philosophy degree.' },
        { word: 'qualitative', syllables: 'qual-i-ta-tive', hint: 'Relating to, measuring, or measured by the quality of something', definition: 'Relating to, measuring, or measured by the quality of something rather than its quantity.' },
        { word: 'quantitative', syllables: 'quan-ti-ta-tive', hint: 'Relating to, measuring, or measured by the quantity of something', definition: 'Relating to, measuring, or measured by the quantity of something rather than its quality.' },
        { word: 'empirical', syllables: 'em-pir-i-cal', hint: 'Based on observation or experience rather than theory', definition: 'Based on, concerned with, or verifiable by observation or experience rather than theory or pure logic.' },
        { word: 'theoretical', syllables: 'the-o-ret-i-cal', hint: 'Concerned with the theory of a subject rather than its practical application', definition: 'Concerned with or involving the theory of a subject or area of study rather than its practical application.' },
        { word: 'postulate', syllables: 'pos-tu-late', hint: 'To suggest or assume the existence or truth of something as a basis for reasoning', definition: 'Suggest or assume the existence, fact, or truth of (something) as a basis for reasoning, discussion, or belief.' },
        { word: 'conjecture', syllables: 'con-jec-ture', hint: 'An opinion or conclusion formed on the basis of incomplete information', definition: 'An opinion or conclusion formed on the basis of incomplete information.' },
        { word: 'correlation', syllables: 'cor-re-la-tion', hint: 'A mutual relationship or connection between two or more things', definition: 'A mutual relationship or connection between two or more things.' },
        { word: 'causation', syllables: 'cau-sa-tion', hint: 'The action of causing something', definition: 'The relationship between cause and effect; causality.' },
        { word: 'lexicon', syllables: 'lex-i-con', hint: 'The vocabulary of a person, language, or branch of knowledge', definition: 'The vocabulary of a person, language, or branch of knowledge.' },
        { word: 'syntax', syllables: 'syn-tax', hint: 'The arrangement of words and phrases to create well-formed sentences', definition: 'The arrangement of words and phrases to create well-formed sentences in a language.' },
        { word: 'semantics', syllables: 'se-man-tics', hint: 'The branch of linguistics concerned with meaning', definition: 'The branch of linguistics and logic concerned with meaning.' },
        { word: 'rhetoric', syllables: 'rhet-o-ric', hint: 'The art of effective or persuasive speaking or writing', definition: 'The art of effective or persuasive speaking or writing, especially the use of figures of speech and other compositional techniques.' },
        { word: 'synthesis', syllables: 'syn-the-sis', hint: 'The combination of ideas to form a theory or system', definition: 'The combination of components or elements to form a connected whole.' },
        { word: 'thesis', syllables: 'the-sis', hint: 'A statement or theory put forward to be maintained or proved', definition: 'A statement or theory that is put forward as a premise to be maintained or proved.' }
      ]
    },
    expert: {
      generalVocabulary: [
        { word: 'pulchritudinous', syllables: 'pul-chri-tu-di-nous', hint: 'Having great physical beauty', definition: 'Characterized by or having great physical beauty and appeal.' },
        { word: 'sesquipedalian', syllables: 'ses-qui-pe-da-li-an', hint: 'Using long words; long-winded', definition: 'Given to using long words.' },
        { word: 'indefatigable', syllables: 'in-de-fat-i-ga-ble', hint: 'Persisting tirelessly', definition: '(of a person or their efforts) persisting tirelessly.' },
        { word: 'grandiloquent', syllables: 'gran-dil-o-quent', hint: 'Pompous or extravagant in language', definition: 'Pompous or extravagant in language, style, or manner, especially in a way that is intended to impress.' },
        { word: 'obsequious', syllables: 'ob-se-qui-ous', hint: 'Obedient or attentive to an excessive degree', definition: 'Obedient or attentive to an excessive or servile degree.' },
        { word: 'sycophant', syllables: 'syc-o-phant', hint: 'A person who acts obediently toward someone important to gain advantage', definition: 'A person who acts obsequiously toward someone important in order to gain advantage.' },
        { word: 'recalcitrant', syllables: 're-cal-ci-trant', hint: 'Having an uncooperative attitude toward authority', definition: 'Having an obstinately uncooperative attitude toward authority or discipline.' },
        { word: 'perfunctory', syllables: 'per-func-to-ry', hint: 'Carried out with a minimum of effort or reflection', definition: '(of an action or gesture) carried out with a minimum of effort or reflection.' },
        { word: 'esoteric', syllables: 'es-o-ter-ic', hint: 'Intended for or understood by only a small number of people', definition: 'Intended for or likely to be understood by only a small number of people with a specialized knowledge or interest.' },
        { word: 'arcane', syllables: 'ar-cane', hint: 'Understood by few; mysterious or secret', definition: 'Understood by few; mysterious or secret.' },
        { word: 'lugubrious', syllables: 'lu-gu-bri-ous', hint: 'Looking or sounding sad and dismal', definition: 'Looking or sounding sad and dismal.' },
        { word: 'salubrious', syllables: 'sa-lu-bri-ous', hint: 'Health-giving; healthy', definition: 'Health-giving; healthy.' },
        { word: 'pernicious', syllables: 'per-ni-cious', hint: 'Having a harmful effect, especially in a gradual way', definition: 'Having a harmful effect, especially in a gradual or subtle way.' },
        { word: 'anathema', syllables: 'a-nath-e-ma', hint: 'Something or someone that one vehemently dislikes', definition: 'Something or someone that one vehemently dislikes.' },
        { word: 'vitriolic', syllables: 'vit-ri-ol-ic', hint: 'Filled with bitter criticism or malice', definition: 'Filled with bitter criticism or malice.' },
        { word: 'panacea', syllables: 'pan-a-ce-a', hint: 'A solution or remedy for all difficulties or diseases', definition: 'A solution or remedy for all difficulties or diseases.' },
        { word: 'bombastic', syllables: 'bom-bas-tic', hint: 'High-sounding but with little meaning; inflated', definition: 'High-sounding but with little meaning; inflated.' },
        { word: 'cacophony', syllables: 'ca-coph-o-ny', hint: 'A harsh, discordant mixture of sounds', definition: 'A harsh, discordant mixture of sounds.' },
        { word: 'euphony', syllables: 'eu-pho-ny', hint: 'The quality of being pleasing to the ear', definition: 'The quality of being pleasing to the ear, especially through a harmonious combination of words.' },
        { word: 'juxtaposition', syllables: 'jux-ta-po-si-tion', hint: 'Placing two things together for contrasting effect', definition: 'The fact of two things being seen or placed close together with contrasting effect.' }
      ],
      scienceAndTechnology: [
        { word: 'crystallography', syllables: 'crys-tal-log-ra-phy', hint: 'The science dealing with the geometric structure of crystals', definition: 'The branch of science concerned with the structure and properties of crystals.' },
        { word: 'bioinformatics', syllables: 'bi-o-in-for-mat-ics', hint: 'The science of collecting and analyzing complex biological data', definition: 'The science of collecting and analyzing complex biological data such as genetic codes.' },
        { word: 'cybernetics', syllables: 'cy-ber-net-ics', hint: 'The science of communications and control systems in machines and living things', definition: 'The science of communications and automatic control systems in both machines and living things.' },
        { word: 'stochastic', syllables: 'sto-chas-tic', hint: 'Having a random probability distribution or pattern', definition: 'Randomly determined; having a random probability distribution or pattern that may be analyzed statistically but may not be predicted precisely.' },
        { word: 'telemetry', syllables: 'te-lem-e-try', hint: 'The process of recording and transmitting the readings of an instrument', definition: 'The collection of measurements or other data at remote points and their automatic transmission to receiving equipment for monitoring.' },
        { word: 'morphogenesis', syllables: 'mor-pho-gen-e-sis', hint: 'The origin and development of morphological characteristics', definition: 'The biological process that causes an organism to develop its shape.' },
        { word: 'spectroscopy', syllables: 'spec-tros-co-py', hint: 'The study of the interaction between matter and electromagnetic radiation', definition: 'The branch of science concerned with the investigation and measurement of spectra produced when matter interacts with or emits electromagnetic radiation.' },
        { word: 'enantiomer', syllables: 'e-nan-ti-o-mer', hint: 'Each of a pair of molecules that are mirror images of each other', definition: 'Each of a pair of molecules that are mirror images of each other.' },
        { word: 'polymerization', syllables: 'po-lym-er-i-za-tion', hint: 'A process of reacting monomer molecules together to form polymer chains', definition: 'A process of reacting monomer molecules together in a chemical reaction to form polymer chains or three-dimensional networks.' },
        { word: 'cyclotron', syllables: 'cy-clo-tron', hint: 'An apparatus in which charged atomic particles are accelerated', definition: 'An apparatus in which charged atomic and subatomic particles are accelerated by an alternating electric field while following an outward spiral or circular path in a magnetic field.' },
        { word: 'photovoltaic', syllables: 'pho-to-vol-ta-ic', hint: 'Relating to the production of electric current at the junction of two substances exposed to light', definition: 'Relating to the production of electric current at the junction of two substances exposed to light.' },
        { word: 'exobiology', syllables: 'ex-o-bi-ol-o-gy', hint: 'The branch of science that deals with the possibility of life on other planets', definition: 'The branch of science that deals with the possibility and likely nature of life on other planets or in space.' },
        { word: 'genomics', syllables: 'ge-nom-ics', hint: 'The branch of molecular biology concerned with the structure and function of genomes', definition: 'The branch of molecular biology concerned with the structure, function, evolution, and mapping of genomes.' },
        { word: 'proteomics', syllables: 'pro-te-om-ics', hint: 'The large-scale study of proteins', definition: 'The large-scale study of proteins, particularly their structures and functions.' },
        { word: 'hadron', syllables: 'had-ron', hint: 'A subatomic particle of a type including the baryons and mesons', definition: 'A composite particle made of quarks held together by the strong force.' },
        { word: 'boson', syllables: 'bo-son', hint: 'A subatomic particle, such as a photon, that has zero or integral spin', definition: 'A subatomic particle, such as a photon, that has zero or integral spin and follows the statistical description given by S. N. Bose and Einstein.' },
        { word: 'heuristic', syllables: 'heu-ris-tic', hint: 'Enabling a person to discover or learn something for themselves', definition: 'Enabling a person to discover or learn something for themselves.' },
        { word: 'paradigm', syllables: 'par-a-digm', hint: 'A typical example or pattern of something; a model', definition: 'A typical example or pattern of something; a model.' },
        { word: 'synthesis', syllables: 'syn-the-sis', hint: 'The combination of ideas to form a theory or system', definition: 'The combination of components or elements to form a connected whole.' },
        { word: 'entanglement', syllables: 'en-tan-gle-ment', hint: 'Quantum mechanical phenomenon where particles are linked', definition: 'A quantum mechanical phenomenon in which the quantum states of two or more objects have to be described with reference to each other.' }
      ],
      literatureAndArts: [
        { word: 'diegesis', syllables: 'di-e-ge-sis', hint: 'The narrative world of a story', definition: 'A narrative or plot, typically in a movie.' },
        { word: 'hermeneutics', syllables: 'her-me-neu-tics', hint: 'The branch of knowledge that deals with interpretation', definition: 'The branch of knowledge that deals with interpretation, especially of the Bible or literary texts.' },
        { word: 'semiotics', syllables: 'se-mi-ot-ics', hint: 'The study of signs and symbols and their use', definition: 'The study of signs and symbols and their use or interpretation.' },
        { word: 'deconstruction', syllables: 'de-con-struc-tion', hint: 'A method of critical analysis of philosophical and literary language', definition: 'A method of critical analysis of philosophical and literary language which emphasizes the internal workings of language and conceptual systems.' },
        { word: 'intertextuality', syllables: 'in-ter-tex-tu-al-i-ty', hint: 'The relationship between texts, especially literary ones', definition: 'The relationship between texts, especially literary ones.' },
        { word: 'palimpsest', syllables: 'pa-limp-sest', hint: 'Something reused or altered but still bearing visible traces of its earlier form', definition: 'Something reused or altered but still bearing visible traces of its earlier form.' },
        { word: 'synecdoche', syllables: 'syn-ec-do-che', hint: 'A figure of speech in which a part is made to represent the whole', definition: 'A figure of speech in which a part is made to represent the whole or vice versa (e.g., Cleveland won by six runs, meaning “Cleveland\'s baseball team”).' },
        { word: 'metonymy', syllables: 'me-ton-y-my', hint: 'The substitution of the name of an attribute for that of the thing meant', definition: 'The substitution of the name of an attribute or adjunct for that of the thing meant (e.g., suit for business executive).' },
        { word: 'chiasmus', syllables: 'chi-as-mus', hint: 'A rhetorical or literary figure in which words are repeated in reverse order', definition: 'A rhetorical or literary figure in which words, grammatical constructions, or concepts are repeated in reverse order.' },
        { word: 'ekphrasis', syllables: 'ek-phra-sis', hint: 'A vivid, often dramatic, verbal description of a work of art', definition: 'A literary description of or commentary on a visual work of art.' },
        { word: 'prolepsis', syllables: 'pro-lep-sis', hint: 'The representation of a thing as existing before it actually does', definition: 'The anticipation and answering of possible objections in rhetorical speech.' },
        { word: 'mise en abyme', syllables: 'mise en a-byme', hint: 'A formal technique of placing a copy of an image within itself', definition: 'A formal technique of placing a copy of an image within itself, often in a way that suggests an infinitely recurring sequence.' },
        { word: 'polyphony', syllables: 'po-lyph-o-ny', hint: 'The style of simultaneously combining a number of parts, each forming an individual melody', definition: 'The style of simultaneously combining a number of parts, each forming an individual melody and harmonizing with each other.' },
        { word: 'heteroglossia', syllables: 'het-er-o-glos-sia', hint: 'The presence of two or more voices or styles of discourse in a text', definition: 'The presence of two or more voices or expressed viewpoints in a text or other artistic work.' },
        { word: 'defamiliarization', syllables: 'de-fa-mil-iar-i-za-tion', hint: 'The artistic technique of presenting common things in an unfamiliar way', definition: 'The artistic technique of presenting to audiences common things in an unfamiliar or strange way in order to enhance perception of the familiar.' },
        { word: 'sublime', syllables: 'sub-lime', hint: 'Of such excellence or beauty as to inspire great admiration', definition: 'Of such excellence, grandeur, or beauty as to inspire great admiration or awe.' },
        { word: 'grotesque', syllables: 'gro-tesque', hint: 'Comically or repulsively ugly or distorted', definition: 'Comically or repulsively ugly or distorted.' },
        { word: 'arabesque', syllables: 'ar-a-besque', hint: 'An ornamental design consisting of intertwined flowing lines', definition: 'An ornamental design consisting of intertwined flowing lines, originally found in Arabic or Moorish decoration.' },
        { word: 'analepsis', syllables: 'an-a-lep-sis', hint: 'A flashback; a past event is narrated at a later point in the story', definition: 'A passage in a narrative that depicts events that occurred before the current point in the story.' },
        { word: 'zeugma', syllables: 'zeug-ma', hint: 'A figure of speech where a word applies to two others in different senses', definition: 'A figure of speech in which a word applies to two others in different senses (e.g., John and his license expired last week).' }
      ],
      historyAndSocialStudies: [
        { word: 'historiography', syllables: 'his-to-ri-og-ra-phy', hint: 'The study of the writing of history', definition: 'The study of historical writing.' },
        { word: 'suzerainty', syllables: 'su-ze-rain-ty', hint: 'A relationship in which one state controls the foreign policy of another', definition: 'A relationship in which a powerful state controls the foreign policy and international relations of a tributary state.' },
        { word: 'irredentism', syllables: 'ir-re-den-tism', hint: 'A policy of advocating the restoration to a country of any territory formerly belonging to it', definition: 'A policy of advocating the restoration to a country of any territory formerly belonging to it.' },
        { word: 'revanchism', syllables: 're-van-chism', hint: 'A policy of seeking to retaliate, especially to recover lost territory', definition: 'A policy of seeking to retaliate, especially to recover lost territory.' },
        { word: 'gerrymandering', syllables: 'ger-ry-man-der-ing', hint: 'Manipulating the boundaries of an electoral constituency to favor one party', definition: 'Manipulate the boundaries of (an electoral constituency) so as to favor one party or class.' },
        { word: 'filibuster', syllables: 'fil-i-bus-ter', hint: 'An action such as a prolonged speech that obstructs progress in a legislative assembly', definition: 'An action such as a prolonged speech that obstructs progress in a legislative assembly while not technically contravening the required procedures.' },
        { word: 'plutocracy', syllables: 'plu-toc-ra-cy', hint: 'Government by the wealthy', definition: 'Government by the wealthy.' },
        { word: 'kleptocracy', syllables: 'klep-toc-ra-cy', hint: 'A government with corrupt leaders that use their power to exploit the people', definition: 'A government with corrupt leaders (kleptocrats) that use their power to exploit the people and natural resources of their own territory in order to extend their personal wealth and political power.' },
        { word: 'autarky', syllables: 'au-tar-ky', hint: 'Economic independence or self-sufficiency', definition: 'Economic independence or self-sufficiency.' },
        { word: 'syndicalism', syllables: 'syn-di-cal-ism', hint: 'A movement for transferring the ownership and control of the means of production to workers\' unions', definition: 'A movement for transferring the ownership and control of the means of production and distribution to workers\' unions.' },
        { word: 'positivism', syllables: 'pos-i-tiv-ism', hint: 'A philosophical system that holds that every rationally justifiable assertion can be scientifically verified', definition: 'A philosophical system that holds that every rationally justifiable assertion can be scientifically verified or is capable of logical or mathematical proof.' },
        { word: 'revisionism', syllables: 're-vi-sion-ism', hint: 'A policy of revision or re-examination of a historical account', definition: 'The theory or practice of revising one\'s attitude to a previously accepted situation or point of view.' },
        { word: 'post-colonialism', syllables: 'post-co-lo-ni-al-ism', hint: 'The political or cultural condition of a former colony', definition: 'The historical period or state of affairs representing the aftermath of Western colonialism.' },
        { word: 'subaltern', syllables: 'sub-al-tern', hint: 'Of lower status', definition: 'Of lower status.' },
        { word: 'panopticism', syllables: 'pan-op-ti-cism', hint: 'The concept of a social control system where the few watch the many', definition: 'The idea of a social system of control in which a few watch the many, derived from the design of the Panopticon prison.' },
        { word: 'neoliberalism', syllables: 'ne-o-lib-er-al-ism', hint: 'A policy model that emphasizes the value of free market competition', definition: 'A modified form of liberalism tending to favor free-market capitalism.' },
        { word: 'gentrification', syllables: 'gen-tri-fi-ca-tion', hint: 'The process of renovating a district so it conforms to middle-class taste', definition: 'The process whereby the character of a poor urban area is changed by wealthier people moving in, improving housing, and attracting new businesses.' },
        { word: 'sectarianism', syllables: 'sec-tar-i-an-ism', hint: 'Excessive attachment to a particular sect or party', definition: 'Excessive attachment to a particular sect or party, especially in religion.' },
        { word: 'biopolitics', syllables: 'bi-o-pol-i-tics', hint: 'The intersection of life sciences and politics', definition: 'The study of the political and social implications of biological research and its applications.' },
        { word: 'hegemony', syllables: 'he-gem-o-ny', hint: 'Dominance by one country or social group', definition: 'Leadership or dominance, especially by one country or social group over others.' }
      ],
      natureAndGeography: [
        { word: 'orogenesis', syllables: 'o-ro-gen-e-sis', hint: 'The process of mountain formation', definition: 'The process of mountain formation, especially by a folding and faulting of the earth\'s crust.' },
        { word: 'bathymetry', syllables: 'ba-thym-e-try', hint: 'The measurement of depth of water in oceans or seas', definition: 'The measurement of depth of water in oceans, seas, or lakes.' },
        { word: 'limnology', syllables: 'lim-nol-o-gy', hint: 'The study of biological and physical features of lakes and other fresh water', definition: 'The study of the biological, chemical, and physical features of lakes and other bodies of fresh water.' },
        { word: 'cryosphere', syllables: 'cry-o-sphere', hint: 'The frozen water part of the Earth system', definition: 'The frozen water part of the Earth system.' },
        { word: 'lithosphere', syllables: 'lith-o-sphere', hint: 'The rigid outer part of the earth, consisting of the crust and upper mantle', definition: 'The rigid outer part of the earth, consisting of the crust and upper mantle.' },
        { word: 'pedogenesis', syllables: 'ped-o-gen-e-sis', hint: 'The process of soil formation', definition: 'The process of soil formation.' },
        { word: 'edaphic', syllables: 'e-daph-ic', hint: 'Relating to soil', definition: 'Relating to or resulting from the nature and properties of the soil.' },
        { word: 'benthic', syllables: 'ben-thic', hint: 'Relating to the bottom of a sea, lake, or river', definition: 'Relating to or occurring at the bottom of a body of water.' },
        { word: 'pelagic', syllables: 'pe-lag-ic', hint: 'Relating to the open sea', definition: 'Relating to the open sea.' },
        { word: 'riparian', syllables: 'ri-par-i-an', hint: 'Relating to or situated on the banks of a river', definition: 'Relating to or situated on the banks of a river.' },
        { word: 'xerophytic', syllables: 'xe-ro-phyt-ic', hint: 'A type of plant that is adapted to a dry habitat', definition: '(of a plant) adapted for life and growth with a limited water supply.' },
        { word: 'halophytic', syllables: 'hal-o-phyt-ic', hint: 'A plant adapted to growing in saline conditions', definition: '(of a plant) adapted to growing in saline conditions, as in a salt marsh.' },
        { word: 'thermocline', syllables: 'ther-mo-cline', hint: 'A steep temperature gradient in a body of water', definition: 'A steep temperature gradient in a body of water such as a lake, marked by a layer above and below which the water is at different temperatures.' },
        { word: 'inselberg', syllables: 'in-sel-berg', hint: 'An isolated rock hill or small mountain rising abruptly from a flat plain', definition: 'An isolated rock hill, knob, ridge, or small mountain that rises abruptly from a gently sloping or virtually level surrounding plain.' },
        { word: 'moraine', syllables: 'mo-raine', hint: 'A mass of rocks and sediment carried down and deposited by a glacier', definition: 'A mass of rocks and sediment carried down and deposited by a glacier, typically as ridges at its edges or extremity.' },
        { word: 'esker', syllables: 'es-ker', hint: 'A long ridge of gravel and other sediment, deposited by meltwater from a retreating glacier', definition: 'A long ridge of gravel and other sediment, typically having a winding course, deposited by meltwater from a retreating glacier or ice sheet.' },
        { word: 'drumlin', syllables: 'drum-lin', hint: 'A low oval mound or small hill, formed by past glacial action', definition: 'A low oval mound or small hill, typically one of a group, consisting of compacted boulder clay molded by past glacial action.' },
        { word: 'cirque', syllables: 'cirque', hint: 'A half-open steep-sided hollow at the head of a valley or on a mountainside', definition: 'A half-open steep-sided hollow at the head of a valley or on a mountainside, formed by glacial erosion.' },
        { word: 'pycnocline', syllables: 'pyc-no-cline', hint: 'A layer in a body of water in which water density increases rapidly with depth', definition: 'A layer in an ocean or other body of water in which water density increases rapidly with depth.' },
        { word: 'tarn', syllables: 'tarn', hint: 'A small mountain lake', definition: 'A small mountain lake.' }
      ],
      academicLanguage: [
        { word: 'epistemology', syllables: 'e-pis-te-mol-o-gy', hint: 'The theory of knowledge itself', definition: 'The theory of knowledge, especially with regard to its methods, validity, and scope.' },
        { word: 'ontology', syllables: 'on-tol-o-gy', hint: 'The branch of metaphysics dealing with the nature of being', definition: 'The branch of metaphysics dealing with the nature of being.' },
        { word: 'hermeneutics', syllables: 'her-me-neu-tics', hint: 'The branch of knowledge that deals with interpretation', definition: 'The branch of knowledge that deals with interpretation, especially of the Bible or literary texts.' },
        { word: 'phenomenology', syllables: 'phe-nom-e-nol-o-gy', hint: 'The study of structures of consciousness as experienced from the first-person point of view', definition: 'An approach that concentrates on the study of consciousness and the objects of direct experience.' },
        { word: 'positivism', syllables: 'pos-i-tiv-ism', hint: 'A philosophical theory stating that certain knowledge is based on natural phenomena', definition: 'A philosophical system that holds that every rationally justifiable assertion can be scientifically verified or is capable of logical or mathematical proof.' },
        { word: 'structuralism', syllables: 'struc-tur-al-ism', hint: 'A method of interpretation that analyzes a text as a system of signs', definition: 'A method of interpretation and analysis of aspects of human cognition, behavior, and culture that focuses on relationships of contrast between elements in a conceptual system.' },
        { word: 'post-structuralism', syllables: 'post-struc-tur-al-ism', hint: 'A critical theory that rejects the idea of a stable, underlying structure', definition: 'An extension and critique of structuralism, especially as used in critical textual analysis.' },
        { word: 'deconstruction', syllables: 'de-con-struc-tion', hint: 'A method of critical analysis of philosophical and literary language', definition: 'A method of critical analysis of philosophical and literary language which emphasizes the internal workings of language and conceptual systems.' },
        { word: 'exegesis', syllables: 'ex-e-ge-sis', hint: 'Critical explanation or interpretation of a text, especially of scripture', definition: 'Critical explanation or interpretation of a text, especially of scripture.' },
        { word: 'didactic', syllables: 'di-dac-tic', hint: 'Intended to teach, particularly in having moral instruction', definition: 'Intended to teach, particularly in having moral instruction as an ulterior motive.' },
        { word: 'polemic', syllables: 'po-lem-ic', hint: 'A strong verbal or written attack on someone or something', definition: 'A strong verbal or written attack on someone or something.' },
        { word: 'treatise', syllables: 'trea-tise', hint: 'A written work dealing formally and systematically with a subject', definition: 'A written work dealing formally and systematically with a subject.' },
        { word: 'monograph', syllables: 'mon-o-graph', hint: 'A detailed written study of a single specialized subject', definition: 'A detailed written study of a single specialized subject or an aspect of it.' },
        { word: 'heuristic', syllables: 'heu-ris-tic', hint: 'A practical approach to problem solving, not guaranteed to be optimal', definition: 'Proceeding to a solution by trial and error or by rules that are only loosely defined.' },
        { word: 'tautology', syllables: 'tau-tol-o-gy', hint: 'Saying the same thing twice in different words, considered to be a fault of style', definition: 'The saying of the same thing twice in different words, generally considered to be a fault of style (e.g., they arrived one after another in succession).' },
        { word: 'syllogism', syllables: 'syl-lo-gism', hint: 'A form of reasoning in which a conclusion is drawn from two given propositions', definition: 'An instance of a form of reasoning in which a conclusion is drawn (whether validly or not) from two given or assumed propositions (premises).' },
        { word: 'dialectic', syllables: 'di-a-lec-tic', hint: 'The art of investigating the truth of opinions through logical discussion', definition: 'The art of investigating or discussing the truth of opinions.' },
        { word: 'teleology', syllables: 'te-le-ol-o-gy', hint: 'The explanation of phenomena in terms of the purpose they serve rather than their cause', definition: 'The explanation of phenomena in terms of the purpose they serve rather than of the cause by which they arise.' },
        { word: 'paradigm', syllables: 'par-a-digm', hint: 'A typical example or pattern of something; a model', definition: 'A typical example or pattern of something; a model.' },
        { word: 'synthesis', syllables: 'syn-the-sis', hint: 'The combination of ideas to form a theory or system', definition: 'The combination of components or elements to form a connected whole.' }
      ]
    }
  };

  // Fallback words in case of database access issues
  const fallbackWords = {
    easy: [
      { word: 'cat', syllables: 'cat', hint: 'A small furry pet that purrs' },
      { word: 'dog', syllables: 'dog', hint: 'A loyal four-legged friend' },
      { word: 'house', syllables: 'house', hint: 'A place where people live' },
      { word: 'water', syllables: 'wa-ter', hint: 'Clear liquid we drink' },
      { word: 'happy', syllables: 'hap-py', hint: 'Feeling joy and pleasure' }
    ],
    medium: [
      { word: 'beautiful', syllables: 'beau-ti-ful', hint: 'Very pretty or attractive' },
      { word: 'computer', syllables: 'com-pu-ter', hint: 'Electronic device for processing data' },
      { word: 'wonderful', syllables: 'won-der-ful', hint: 'Extremely good or impressive' },
      { word: 'important', syllables: 'im-por-tant', hint: 'Having great significance' }
    ],
    hard: [
      { word: 'extraordinary', syllables: 'ex-traor-di-nary', hint: 'Very unusual or remarkable' },
      { word: 'magnificent', syllables: 'mag-nif-i-cent', hint: 'Extremely beautiful or impressive' },
      { word: 'philosophical', syllables: 'phi-lo-soph-i-cal', hint: 'Related to deep thinking about life' }
    ],
    expert: [
      { word: 'incomprehensible', syllables: 'in-com-pre-hen-si-ble', hint: 'Impossible to understand' },
      { word: 'serendipitous', syllables: 'ser-en-dip-i-tous', hint: 'Happening by happy chance' },
      { word: 'perspicacious', syllables: 'per-spi-ca-cious', hint: 'Having keen insight' }
    ]
  };

  // Category mapping function
  const getCategoryKey = (category) => {
    const categoryMap = {
      'general': 'generalVocabulary',
      'science': 'scienceAndTechnology',
      'literature': 'literatureAndArts',
      'history': 'generalVocabulary', // fallback to general
      'nature': 'scienceAndTechnology', // fallback to science
      'academic': 'generalVocabulary' // fallback to general
    };
    return categoryMap[category] || 'generalVocabulary';
  };

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speak = (text, rate = 1, pitch = 1) => {
    if (!audioEnabled || !synthRef.current) return;
    
    try {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = 0.8;
      
      // Add event listeners for better error handling
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
      };
      
      utterance.onend = () => {
        console.log('Speech synthesis completed');
      };
      
      synthRef.current.speak(utterance);
    } catch (error) {
      console.error('Error with speech synthesis:', error);
    }
  };

  const speakSyllables = (syllableText) => {
    if (!audioEnabled || !synthRef.current) return;
    
    try {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(syllableText);
      utterance.rate = 0.6;
      utterance.pitch = 1.1;
      utterance.volume = 0.9;
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
      };
      
      synthRef.current.speak(utterance);
    } catch (error) {
      console.error('Error with speech synthesis:', error);
    }
  };

  const generateWord = async () => {
    setLoading(true);
    try {
      // Get the correct category key for the database
      const categoryKey = getCategoryKey(category);
      
      // Get words from the appropriate difficulty and category
      const categoryWords = wordDatabase[difficulty] && wordDatabase[difficulty][categoryKey] 
        ? wordDatabase[difficulty][categoryKey]
        : wordDatabase[difficulty] && wordDatabase[difficulty]['generalVocabulary']
        ? wordDatabase[difficulty]['generalVocabulary']
        : fallbackWords[difficulty] || fallbackWords['easy'];
      
      // Filter out words that have been used recently
      const recentWords = wordHistory.slice(-5).map(entry => entry.word);
      const availableWords = categoryWords.filter(wordData => !recentWords.includes(wordData.word));
      
      // If all words have been used recently, reset the filter
      const wordsToChooseFrom = availableWords.length > 0 ? availableWords : categoryWords;
      
      // Select a random word
      const randomWord = wordsToChooseFrom[Math.floor(Math.random() * wordsToChooseFrom.length)];
      
      if (randomWord) {
        setCurrentWord(randomWord.word.toLowerCase());
        setSyllables(randomWord.syllables);
        setCurrentHint(randomWord.hint || randomWord.definition);
        setShowResult(false);
        setUserAnswer('');
        
        // Speak the word after a short delay
        setTimeout(() => {
          speak(randomWord.word);
        }, 500);
      } else {
        console.error('No word found');
      }
      
    } catch (error) {
      console.error('Error generating word:', error);
      // Use fallback word
      const fallback = fallbackWords.easy[0];
      setCurrentWord(fallback.word.toLowerCase());
      setSyllables(fallback.syllables);
      setCurrentHint(fallback.hint);
      setShowResult(false);
      setUserAnswer('');
    }
    setLoading(false);
  };

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;
    
    const correct = userAnswer.toLowerCase().trim() === currentWord.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);
    
    const newStats = {
      totalWords: gameStats.totalWords + 1,
      correctWords: gameStats.correctWords + (correct ? 1 : 0),
      accuracy: Math.round(((gameStats.correctWords + (correct ? 1 : 0)) / (gameStats.totalWords + 1)) * 100)
    };
    setGameStats(newStats);
    
    if (correct) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setBestStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
      speak("Correct! Well done!");
    } else {
      setStreak(0);
      speak("Not quite right. The correct spelling is " + currentWord);
    }
    
    setWordHistory(prev => [...prev, {
      word: currentWord,
      userAnswer: userAnswer,
      correct: correct,
      syllables: syllables,
      hint: currentHint
    }]);
  };

  const nextWord = () => {
    generateWord();
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setStreak(0);
    setWordHistory([]);
    setGameStats({ totalWords: 0, correctWords: 0, accuracy: 0 });
    generateWord();
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentWord('');
    setSyllables('');
    setUserAnswer('');
    setShowResult(false);
    setScore(0);
    setStreak(0);
    setWordHistory([]);
    setGameStats({ totalWords: 0, correctWords: 0, accuracy: 0 });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (showResult) {
        nextWord();
      } else {
        handleSubmit();
      }
    }
  };

  useEffect(() => {
    if (inputRef.current && !showResult) {
      inputRef.current.focus();
    }
  }, [showResult, currentWord]);

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Spelling Master</h1>
            <p className="text-gray-600">Improve your English spelling with curated words</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="easy">Easy (3-5 letters)</option>
                <option value="medium">Medium (6-8 letters)</option>
                <option value="hard">Hard (9+ letters)</option>
                <option value="expert">Expert (Complex words)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="general">General Vocabulary</option>
                <option value="science">Science & Technology</option>
                <option value="literature">Literature & Arts</option>
                <option value="history">History & Social Studies</option>
                <option value="nature">Nature & Geography</option>
                <option value="academic">Academic Language</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Audio</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setAudioEnabled(!audioEnabled);
                    // Test audio when enabling
                    if (!audioEnabled) {
                      setTimeout(() => speak("Audio test"), 100);
                    }
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    audioEnabled 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{audioEnabled ? 'Enabled' : 'Disabled'}</span>
                </button>
                {audioEnabled && (
                  <button
                    onClick={() => speak("Audio test")}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                  >
                    Test
                  </button>
                )}
              </div>
            </div>
            
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Spelling Master</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  audioEnabled 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button
                onClick={resetGame}
                className="flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex justify-around items-center">
            <div className="flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <div>
                <div className="text-xl font-bold text-gray-800">{score}</div>
                <div className="text-xs text-gray-600">Score</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-6 h-6 text-orange-500" />
              <div>
                <div className="text-xl font-bold text-gray-800">{streak}</div>
                <div className="text-xs text-gray-600">Streak</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">%</span>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">{gameStats.accuracy}%</div>
                <div className="text-xs text-gray-600">Accuracy</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">★</span>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">{bestStreak}</div>
                <div className="text-xs text-gray-600">Best Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading new word...</p>
            </div>
          ) : (
            <div className="text-center">
              {/* Audio Controls */}
              <div className="flex justify-center space-x-4 mb-8">
                <button
                  onClick={() => speak(currentWord)}
                  className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-200 transition-colors"
                  disabled={!audioEnabled}
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Hear Word</span>
                </button>
                <button
                  onClick={() => speakSyllables(syllables)}
                  className="flex items-center space-x-2 bg-green-100 text-green-700 px-6 py-3 rounded-lg hover:bg-green-200 transition-colors"
                  disabled={!audioEnabled}
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Hear Syllables</span>
                </button>
              </div>

              {/* Hint */}
              {currentHint && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800"><strong>Hint:</strong> {currentHint}</p>
                </div>
              )}

              {/* Input Area */}
              <div className="mb-6">
                <input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type the spelling here..."
                  className="w-full max-w-md mx-auto text-center text-2xl p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  disabled={showResult}
                />
              </div>

              {/* Result */}
              {showResult && (
                <div className={`mb-6 p-6 rounded-lg ${
                  isCorrect 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className={`text-2xl font-bold mb-2 ${
                    isCorrect ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                  </div>
                  <div className="text-gray-700">
                    <p><strong>Correct spelling:</strong> {currentWord}</p>
                    <p><strong>Syllables:</strong> {syllables}</p>
                    {!isCorrect && <p><strong>You spelled:</strong> {userAnswer}</p>}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={showResult ? nextWord : handleSubmit}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                disabled={loading}
              >
                {showResult ? 'Next Word' : 'Submit Answer'}
              </button>
            </div>
          )}
        </div>

        {/* Word History */}
        {wordHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Words</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {wordHistory.slice(-10).reverse().map((entry, index) => (
                <div key={index} className={`p-3 rounded-lg ${
                  entry.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{entry.word}</span>
                    <span className={`text-sm ${
                      entry.correct ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {entry.correct ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Syllables: {entry.syllables}
                  </div>
                  {!entry.correct && (
                    <div className="text-sm text-red-600">
                      You spelled: {entry.userAnswer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpellingGame; 