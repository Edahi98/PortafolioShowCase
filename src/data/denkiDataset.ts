export type Genre = 'Acción' | 'Drama' | 'Thriller' | 'Ciencia ficción' | 'Comedia' | 'Animación' | 'Terror';
export type Era = 'Clásico' | 'Moderno' | 'Reciente';

export type DataItem = {
	id: number;
	name: string;      // título de la película
	genre: Genre;
	director: string;
	year: number;
	rating: number;    // 0–100
	duration: number;  // minutos
	language: string;
	era: Era;
};

/** 27 películas — mirrors /public/datasets/denki-sample.docx */
export const DATASET: DataItem[] = [
	{ id: 1,  name: 'El Padrino',                        genre: 'Drama',           director: 'Francis Ford Coppola',       year: 1972, rating: 100, duration: 175, language: 'Inglés',   era: 'Clásico'  },
	{ id: 2,  name: 'Casablanca',                         genre: 'Drama',           director: 'Michael Curtiz',             year: 1942, rating: 100, duration: 102, language: 'Inglés',   era: 'Clásico'  },
	{ id: 3,  name: '2001: Odisea del espacio',           genre: 'Ciencia ficción', director: 'Stanley Kubrick',            year: 1968, rating: 84,  duration: 149, language: 'Inglés',   era: 'Clásico'  },
	{ id: 4,  name: 'Metrópolis',                         genre: 'Ciencia ficción', director: 'Fritz Lang',                 year: 1927, rating: 98,  duration: 153, language: 'Alemán',   era: 'Clásico'  },
	{ id: 5,  name: 'Psicosis',                           genre: 'Terror',          director: 'Alfred Hitchcock',           year: 1960, rating: 97,  duration: 109, language: 'Inglés',   era: 'Clásico'  },
	{ id: 6,  name: 'Pulp Fiction',                       genre: 'Thriller',        director: 'Quentin Tarantino',          year: 1994, rating: 92,  duration: 154, language: 'Inglés',   era: 'Moderno'  },
	{ id: 7,  name: 'Goodfellas',                         genre: 'Drama',           director: 'Martin Scorsese',            year: 1990, rating: 96,  duration: 146, language: 'Inglés',   era: 'Moderno'  },
	{ id: 8,  name: 'La lista de Schindler',              genre: 'Drama',           director: 'Steven Spielberg',           year: 1993, rating: 97,  duration: 195, language: 'Inglés',   era: 'Moderno'  },
	{ id: 9,  name: 'El silencio de los inocentes',       genre: 'Thriller',        director: 'Jonathan Demme',             year: 1991, rating: 79,  duration: 118, language: 'Inglés',   era: 'Moderno'  },
	{ id: 10, name: 'Fight Club',                         genre: 'Thriller',        director: 'David Fincher',              year: 1999, rating: 66,  duration: 139, language: 'Inglés',   era: 'Moderno'  },
	{ id: 11, name: 'The Matrix',                         genre: 'Ciencia ficción', director: 'Lana y Lilly Wachowski',     year: 1999, rating: 73,  duration: 136, language: 'Inglés',   era: 'Moderno'  },
	{ id: 12, name: 'El viaje de Chihiro',                genre: 'Animación',       director: 'Hayao Miyazaki',             year: 2001, rating: 96,  duration: 125, language: 'Japonés',  era: 'Moderno'  },
	{ id: 13, name: 'La princesa Mononoke',               genre: 'Animación',       director: 'Hayao Miyazaki',             year: 1997, rating: 76,  duration: 134, language: 'Japonés',  era: 'Moderno'  },
	{ id: 14, name: 'Amélie',                             genre: 'Comedia',         director: 'Jean-Pierre Jeunet',         year: 2001, rating: 89,  duration: 122, language: 'Francés',  era: 'Moderno'  },
	{ id: 15, name: 'Ciudad de Dios',                     genre: 'Drama',           director: 'Fernando Meirelles',         year: 2002, rating: 79,  duration: 130, language: 'Portugués',era: 'Moderno'  },
	{ id: 16, name: 'Sin perdón',                         genre: 'Acción',          director: 'Clint Eastwood',             year: 1992, rating: 96,  duration: 131, language: 'Inglés',   era: 'Moderno'  },
	{ id: 17, name: 'Oldboy',                             genre: 'Thriller',        director: 'Park Chan-wook',             year: 2003, rating: 73,  duration: 120, language: 'Coreano',  era: 'Moderno'  },
	{ id: 18, name: 'No es país para viejos',             genre: 'Thriller',        director: 'Joel y Ethan Coen',          year: 2007, rating: 91,  duration: 122, language: 'Inglés',   era: 'Moderno'  },
	{ id: 19, name: 'El caballero oscuro',                genre: 'Acción',          director: 'Christopher Nolan',          year: 2008, rating: 84,  duration: 152, language: 'Inglés',   era: 'Moderno'  },
	{ id: 20, name: 'Parásitos',                          genre: 'Thriller',        director: 'Bong Joon-ho',               year: 2019, rating: 96,  duration: 132, language: 'Coreano',  era: 'Reciente' },
	{ id: 21, name: 'Interstellar',                       genre: 'Ciencia ficción', director: 'Christopher Nolan',          year: 2014, rating: 74,  duration: 169, language: 'Inglés',   era: 'Reciente' },
	{ id: 22, name: 'Mad Max: Furia en el camino',        genre: 'Acción',          director: 'George Miller',              year: 2015, rating: 90,  duration: 120, language: 'Inglés',   era: 'Reciente' },
	{ id: 23, name: 'Todo en todas partes al mismo tiempo', genre: 'Ciencia ficción', director: 'Daniel Kwan y Daniel Scheinert', year: 2022, rating: 81, duration: 139, language: 'Inglés', era: 'Reciente' },
	{ id: 24, name: 'El Gran Hotel Budapest',             genre: 'Comedia',         director: 'Wes Anderson',               year: 2014, rating: 88,  duration: 99,  language: 'Inglés',   era: 'Reciente' },
	{ id: 25, name: 'Get Out',                            genre: 'Terror',          director: 'Jordan Peele',               year: 2017, rating: 84,  duration: 104, language: 'Inglés',   era: 'Reciente' },
	{ id: 26, name: 'La La Land',                         genre: 'Comedia',         director: 'Damien Chazelle',            year: 2016, rating: 93,  duration: 128, language: 'Inglés',   era: 'Reciente' },
	{ id: 27, name: 'Coco',                               genre: 'Animación',       director: 'Lee Unkrich',                year: 2017, rating: 81,  duration: 105, language: 'Inglés',   era: 'Reciente' },
];

export const GENRES: Genre[] = ['Acción', 'Drama', 'Thriller', 'Ciencia ficción', 'Comedia', 'Animación', 'Terror'];
export const ERAS: Era[] = ['Clásico', 'Moderno', 'Reciente'];

// Alias para compatibilidad con usePipeline
export const CATEGORIES = GENRES;
export const DIFFICULTIES = ERAS;
export type Category = Genre;
export type Difficulty = Era;
