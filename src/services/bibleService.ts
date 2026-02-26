export interface BibleVerse {
  text: string;
  reference: string;
}

export interface BibleChapter {
  reference: string;
  verses: { chapter: number; verse: number; text: string }[];
}

export const BIBLE_BOOKS = [
  { name: 'Gênesis', id: 'genesis', chapters: 50 }, 
  { name: 'Êxodo', id: 'exodo', chapters: 40 }, 
  { name: 'Levítico', id: 'levitico', chapters: 27 },
  { name: 'Números', id: 'numeros', chapters: 36 }, 
  { name: 'Deuteronômio', id: 'deuteronomio', chapters: 34 }, 
  { name: 'Josué', id: 'josue', chapters: 24 },
  { name: 'Juízes', id: 'juizes', chapters: 21 }, 
  { name: 'Rute', id: 'rute', chapters: 4 }, 
  { name: '1 Samuel', id: '1+samuel', chapters: 31 },
  { name: '2 Samuel', id: '2+samuel', chapters: 24 }, 
  { name: '1 Reis', id: '1+reis', chapters: 22 }, 
  { name: '2 Reis', id: '2+reis', chapters: 25 },
  { name: '1 Crônicas', id: '1+cronicas', chapters: 29 }, 
  { name: '2 Crônicas', id: '2+cronicas', chapters: 36 }, 
  { name: 'Esdras', id: 'esdras', chapters: 10 },
  { name: 'Neemias', id: 'neemias', chapters: 13 }, 
  { name: 'Ester', id: 'ester', chapters: 10 }, 
  { name: 'Jó', id: 'jo', chapters: 42 },
  { name: 'Salmos', id: 'salmos', chapters: 150 }, 
  { name: 'Provérbios', id: 'proverbios', chapters: 31 }, 
  { name: 'Eclesiastes', id: 'eclesiastes', chapters: 12 },
  { name: 'Cânticos', id: 'canticos', chapters: 8 }, 
  { name: 'Isaías', id: 'isaias', chapters: 66 }, 
  { name: 'Jeremias', id: 'jeremias', chapters: 52 },
  { name: 'Lamentações', id: 'lamentacoes', chapters: 5 }, 
  { name: 'Ezequiel', id: 'ezequiel', chapters: 48 }, 
  { name: 'Daniel', id: 'daniel', chapters: 12 },
  { name: 'Oséias', id: 'oseias', chapters: 14 }, 
  { name: 'Joel', id: 'joel', chapters: 3 }, 
  { name: 'Amós', id: 'amos', chapters: 9 },
  { name: 'Obadias', id: 'obadias', chapters: 1 }, 
  { name: 'Jonas', id: 'jonas', chapters: 4 }, 
  { name: 'Miquéias', id: 'miqueias', chapters: 7 },
  { name: 'Naum', id: 'naum', chapters: 3 }, 
  { name: 'Habacuque', id: 'habacuque', chapters: 3 }, 
  { name: 'Sofonias', id: 'sofonias', chapters: 3 },
  { name: 'Ageu', id: 'ageu', chapters: 2 }, 
  { name: 'Zacarias', id: 'zacarias', chapters: 14 }, 
  { name: 'Malaquias', id: 'malaquias', chapters: 4 },
  { name: 'Mateus', id: 'mateus', chapters: 28 }, 
  { name: 'Marcos', id: 'marcos', chapters: 16 }, 
  { name: 'Lucas', id: 'lucas', chapters: 24 },
  { name: 'João', id: 'joao', chapters: 21 }, 
  { name: 'Atos', id: 'atos', chapters: 28 }, 
  { name: 'Romanos', id: 'romanos', chapters: 16 },
  { name: '1 Coríntios', id: '1+corintios', chapters: 16 }, 
  { name: '2 Coríntios', id: '2+corintios', chapters: 13 }, 
  { name: 'Gálatas', id: 'galatas', chapters: 6 },
  { name: 'Efésios', id: 'efesios', chapters: 6 }, 
  { name: 'Filipenses', id: 'filipenses', chapters: 4 }, 
  { name: 'Colossenses', id: 'colossenses', chapters: 4 },
  { name: '1 Tessalonicenses', id: '1+tessalonicenses', chapters: 5 }, 
  { name: '2 Tessalonicenses', id: '2+tessalonicenses', chapters: 3 },
  { name: '1 Timóteo', id: '1+timoteo', chapters: 6 }, 
  { name: '2 Timóteo', id: '2+timoteo', chapters: 4 }, 
  { name: 'Tito', id: 'tito', chapters: 3 },
  { name: 'Filemom', id: 'filemom', chapters: 1 }, 
  { name: 'Hebreus', id: 'hebreus', chapters: 13 }, 
  { name: 'Tiago', id: 'tiago', chapters: 5 },
  { name: '1 Pedro', id: '1+pedro', chapters: 5 }, 
  { name: '2 Pedro', id: '2+pedro', chapters: 3 }, 
  { name: '1 João', id: '1+joao', chapters: 5 },
  { name: '2 João', id: '2+joao', chapters: 1 }, 
  { name: '3 João', id: '3+joao', chapters: 1 }, 
  { name: 'Judas', id: 'judas', chapters: 1 },
  { name: 'Apocalipse', id: 'apocalipse', chapters: 22 }
];

export async function getDailyVerse(): Promise<BibleVerse> {
  try {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    
    // Use Portuguese names for the daily verses as well to be safe
    const references = [
      'joao+3:16', 'filipenses+4:13', 'salmos+23:1', 'proverbios+3:5', 
      'romanos+8:28', 'mateus+6:33', 'isaias+41:10', 'salmos+46:1'
    ];
    const ref = references[dayOfYear % references.length];

    const response = await fetch(`https://bible-api.com/${ref}?translation=almeida`);
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    return {
      text: data.text.trim(),
      reference: data.reference
    };
  } catch (error) {
    return { text: "O Senhor é o meu pastor, nada me faltará.", reference: "Salmos 23:1" };
  }
}

export async function getPsalmOfDay(): Promise<BibleVerse> {
  const today = new Date();
  const day = (today.getDate() % 150) + 1; // 150 Psalms
  
  try {
    const response = await fetch(`https://bible-api.com/salmos+${day}?translation=almeida`);
    const data = await response.json();
    return {
      text: data.text.trim(),
      reference: data.reference
    };
  } catch (e) {
    return { text: "Louvai ao Senhor, porque ele é bom; porque a sua benignidade dura para sempre.", reference: "Salmos 106:1" };
  }
}

export async function getChapter(book: string, chapter: number): Promise<BibleChapter> {
  const response = await fetch(`https://bible-api.com/${book}+${chapter}?translation=almeida`);
  if (!response.ok) throw new Error('Falha ao carregar o capítulo');
  const data = await response.json();
  if (!data.verses || data.verses.length === 0) {
     throw new Error('Nenhum versículo encontrado');
  }
  return data;
}
