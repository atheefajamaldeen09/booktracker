// Every genre the picker suggests when you add or edit a book.
// Grouped here to keep the list readable; the picker shows it A–Z.
// You can still type a genre that isn't here.

const GENERAL_FICTION = [
  "Fiction", "Literary Fiction", "Contemporary Fiction", "General Fiction", "Classics", "Modern Classics",
  "Historical Fiction", "Women's Fiction", "Chick Lit", "Book Club Fiction", "Upmarket Fiction",
  "Domestic Fiction", "Family Saga", "Family Drama", "Coming of Age", "Bildungsroman", "Realistic Fiction",
  "Slice of Life", "Healing Fiction", "Cosy Fiction", "Psychological Fiction", "Philosophical Fiction",
  "Political Fiction", "Satire", "Humour", "Comedy", "Dark Comedy", "Tragedy", "Drama", "Melodrama",
  "Magical Realism", "Absurdist Fiction", "Surrealism", "Experimental Fiction", "Metafiction", "Postmodern",
  "Autofiction", "Biographical Fiction", "Epistolary", "Picaresque", "Pulp Fiction", "Campus Novel",
  "Dark Academia", "Light Academia", "Gothic", "Southern Gothic", "Adventure", "Action",
  "Action & Adventure", "Survival", "Nautical Fiction", "Pirates", "Western", "War Fiction",
  "Military Fiction", "Medical Fiction", "Sports Fiction", "Workplace Fiction", "Road Trip", "Holiday",
  "Christmas", "Fan Fiction", "Erotica", "Translated Fiction", "World Literature", "African Literature",
  "American Literature", "Arabic Literature", "British Literature", "Chinese Literature",
  "French Literature", "German Literature", "Indian Literature", "Irish Literature",
  "Japanese Literature", "Korean Literature", "Latin American Literature", "Russian Literature",
  "South Asian Literature", "Sri Lankan Literature", "Own Voices", "Diaspora Fiction",
  "Immigrant Fiction", "Indigenous Fiction", "LGBTQ+", "Queer Fiction", "Sapphic", "Feminist Fiction",
  "Christian Fiction", "Islamic Fiction", "Jewish Fiction", "Religious Fiction", "Inspirational Fiction",
  "Amish Fiction", "Fable", "Allegory", "Parable", "Fairy Tales", "Fairy Tale Retelling", "Retelling",
  "Mythology", "Myth Retelling", "Greek Mythology", "Norse Mythology", "Folklore", "Legends",
  "Alternate History", "Time Travel",
];

const FANTASY = [
  "Fantasy", "High Fantasy", "Epic Fantasy", "Low Fantasy", "Urban Fantasy", "Dark Fantasy", "Grimdark",
  "Noblebright", "Cosy Fantasy", "Romantasy", "Fantasy Romance", "Portal Fantasy", "Sword and Sorcery",
  "Heroic Fantasy", "Historical Fantasy", "Contemporary Fantasy", "Mythic Fantasy", "Arthurian",
  "Gaslamp Fantasy", "Flintlock Fantasy", "Military Fantasy", "Political Fantasy", "Court Intrigue",
  "Comic Fantasy", "Animal Fantasy", "Science Fantasy", "Paranormal", "Supernatural", "Fae", "Dragons",
  "Witches", "Wizards", "Magic School", "Vampires", "Werewolves", "Shifters", "Angels & Demons",
  "Gods & Goddesses", "Mermaids", "Ghosts", "Superheroes", "Wuxia", "Xianxia", "Cultivation", "LitRPG",
  "GameLit", "Progression Fantasy", "Isekai", "Weird Fiction", "New Weird", "Speculative Fiction",
];

const SCIENCE_FICTION = [
  "Science Fiction", "Hard Science Fiction", "Soft Science Fiction", "Space Opera",
  "Military Science Fiction", "Dystopian", "Utopian", "Post-Apocalyptic", "Apocalyptic", "Cyberpunk",
  "Steampunk", "Solarpunk", "Biopunk", "Dieselpunk", "Hopepunk", "Climate Fiction", "Afrofuturism",
  "Alien Invasion", "First Contact", "Aliens", "Artificial Intelligence", "Robots", "Space Exploration",
  "Space Western", "Colonisation", "Parallel Universe", "Multiverse", "Virtual Reality",
  "Genetic Engineering", "Time Loop", "Science Fiction Romance", "Science Fiction Horror",
  "Science Fiction Mystery", "Kaiju", "Zombies", "Near Future", "Cosy Science Fiction",
];

const ROMANCE = [
  "Romance", "Contemporary Romance", "Historical Romance", "Regency Romance", "Victorian Romance",
  "Highlander Romance", "Romantic Comedy", "Romantic Suspense", "Paranormal Romance", "Dark Romance",
  "Gothic Romance", "New Adult Romance", "Erotic Romance", "Sports Romance", "Hockey Romance",
  "Billionaire Romance", "Mafia Romance", "Small Town Romance", "Cowboy Romance", "Western Romance",
  "Military Romance", "Medical Romance", "Office Romance", "College Romance", "Academic Romance",
  "Bully Romance", "Reverse Harem", "Why Choose", "Monster Romance", "Alien Romance", "Vampire Romance",
  "Shifter Romance", "Omegaverse", "Holiday Romance", "Christmas Romance", "Royal Romance",
  "Rockstar Romance", "Motorcycle Club Romance", "Time Travel Romance", "Christian Romance",
  "Muslim Romance", "Halal Romance", "Amish Romance", "Clean Romance", "Sweet Romance",
  "Closed Door Romance", "Young Adult Romance", "LGBTQ+ Romance", "Sapphic Romance", "MM Romance",
  "Second Chance Romance", "Enemies to Lovers", "Friends to Lovers", "Fake Dating", "Forced Proximity",
  "Arranged Marriage", "Marriage of Convenience", "Age Gap", "Slow Burn", "Forbidden Romance",
  "Love Triangle", "Grumpy Sunshine", "Single Parent Romance", "Workplace Romance", "Love Story",
];

const MYSTERY_THRILLER = [
  "Mystery", "Cosy Mystery", "Murder Mystery", "Whodunit", "Locked Room Mystery", "Golden Age Mystery",
  "Detective Fiction", "Police Procedural", "Private Investigator", "Amateur Sleuth",
  "Historical Mystery", "Paranormal Mystery", "Noir", "Hardboiled", "Nordic Noir", "Crime",
  "Crime Fiction", "Crime Thriller", "Thriller", "Psychological Thriller", "Domestic Thriller",
  "Legal Thriller", "Medical Thriller", "Political Thriller", "Techno-Thriller", "Action Thriller",
  "Conspiracy Thriller", "Supernatural Thriller", "Spy Fiction", "Espionage", "Serial Killer",
  "Suspense", "Heist", "Caper", "Gangster", "Courtroom Drama", "Forensic", "Cold Case",
  "Missing Person", "Revenge",
];

const HORROR = [
  "Horror", "Gothic Horror", "Supernatural Horror", "Psychological Horror", "Cosmic Horror",
  "Lovecraftian", "Body Horror", "Folk Horror", "Haunted House", "Ghost Stories", "Slasher",
  "Splatterpunk", "Extreme Horror", "Monster Horror", "Survival Horror", "Occult", "Possession",
  "Vampire Fiction", "Horror Comedy", "Cosy Horror", "Dark Fiction", "Creepypasta",
];

const AGE_GROUPS = [
  "Children's", "Picture Books", "Board Books", "Early Readers", "Chapter Books", "Middle Grade",
  "Teen", "Young Adult", "YA Fantasy", "YA Contemporary", "YA Dystopian", "YA Mystery",
  "YA Science Fiction", "YA Thriller", "YA Horror", "YA Historical Fiction", "New Adult", "Adult",
  "Juvenile Fiction", "Bedtime Stories", "Nursery Rhymes", "School Stories", "Boarding School",
  "Animal Stories",
];

const FORMATS = [
  "Graphic Novel", "Graphic Memoir", "Comics", "Superhero Comics", "Manga", "Manhwa", "Manhua",
  "Webtoon", "Shonen", "Shojo", "Seinen", "Josei", "Light Novel", "Web Novel", "Poetry",
  "Novel in Verse", "Epic Poetry", "Haiku", "Plays", "Screenplay", "Short Stories",
  "Short Story Collection", "Flash Fiction", "Anthology", "Novella", "Essays", "Letters", "Diary",
  "Serial",
];

const NONFICTION = [
  "Nonfiction", "Narrative Nonfiction", "Creative Nonfiction", "Biography", "Autobiography", "Memoir",
  "Celebrity Memoir", "Journalism", "Reportage", "True Crime", "History", "Ancient History",
  "Medieval History", "Modern History", "Military History", "World History", "Social History",
  "Art History", "Islamic History", "Holocaust", "War", "Politics", "Political Science",
  "Current Affairs", "International Relations", "Law", "Economics", "Business", "Finance",
  "Personal Finance", "Investing", "Entrepreneurship", "Leadership", "Management", "Marketing", "Career",
  "Productivity", "Self-Help", "Personal Development", "Motivational", "Inspirational", "Psychology",
  "Philosophy", "Sociology", "Anthropology", "Archaeology", "Geography", "Science", "Popular Science",
  "Physics", "Astronomy", "Space", "Biology", "Chemistry", "Mathematics", "Neuroscience", "Medicine",
  "Health", "Mental Health", "Wellness", "Fitness", "Nutrition", "Diet", "Grief", "Addiction & Recovery",
  "Disability", "Sexuality", "Nature", "Nature Writing", "Environment", "Ecology", "Climate", "Animals",
  "Pets", "Gardening", "Technology", "Computer Science", "Programming", "Engineering", "Education",
  "Teaching", "Parenting", "Family & Relationships", "Relationships", "Religion", "Spirituality", "Islam",
  "Christianity", "Judaism", "Buddhism", "Hinduism", "Theology", "New Age", "Astrology", "Tarot",
  "Witchcraft", "Mindfulness", "Meditation", "Minimalism", "Travel", "Travelogue", "Guidebook",
  "Food & Drink", "Cookbook", "Baking", "Art", "Photography", "Design", "Architecture", "Fashion",
  "Beauty", "Crafts", "Knitting & Sewing", "DIY", "Home & Interiors", "Music", "Film", "Television",
  "Theatre", "Dance", "Pop Culture", "Gaming", "Sports", "Feminism", "Gender Studies", "LGBTQ+ Studies",
  "Race & Ethnicity", "Cultural Studies", "Social Justice", "Activism", "Linguistics",
  "Language Learning", "Writing", "Literary Criticism", "Books About Books", "Reference", "Dictionary",
  "Encyclopedia", "Textbook", "Academic", "Study Guide", "How-To", "Colouring Book", "Puzzle Book",
  "Trivia", "Transport", "Aviation",
];

export const GENRES = Array.from(
  new Set([
    ...GENERAL_FICTION,
    ...FANTASY,
    ...SCIENCE_FICTION,
    ...ROMANCE,
    ...MYSTERY_THRILLER,
    ...HORROR,
    ...AGE_GROUPS,
    ...FORMATS,
    ...NONFICTION,
  ])
).sort((a, b) => a.localeCompare(b));

const byLowercase = new Map(GENRES.map((g) => [g.toLowerCase(), g]));

// "cosy mystery" → "Cosy Mystery"; something not on the list is kept as you typed it
export const tidyGenre = (raw: string) => {
  const text = raw.trim().replace(/\s+/g, " ");
  return byLowercase.get(text.toLowerCase()) ?? text;
};
