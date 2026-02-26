export interface Artwork {
  url: string;
  title: string;
  artist?: string;
  description?: string;
}

const MYSTERY_ART_DATA: Record<string, Artwork[]> = {
  'Mistérios Gozosos': [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Annunciation_%28Leonardo%29.jpg/1024px-Annunciation_%28Leonardo%29.jpg',
      title: 'A Anunciação',
      artist: 'Leonardo da Vinci',
      description: 'O Arcanjo Gabriel anuncia a Maria que ela será a Mãe do Salvador.'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Workshop_of_Giotto_-_Nativity_at_Lower_Church_Assisi.jpg/1024px-Workshop_of_Giotto_-_Nativity_at_Lower_Church_Assisi.jpg',
      title: 'A Natividade',
      artist: 'Giotto (Oficina)',
      description: 'O nascimento de Jesus em Belém.'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Adoration_of_the_Magi_by_Gentile_da_Fabriano_-_WGA8463.jpg/1024px-Adoration_of_the_Magi_by_Gentile_da_Fabriano_-_WGA8463.jpg',
      title: 'Adoração dos Magos',
      artist: 'Gentile da Fabriano',
      description: 'Os Reis Magos visitam o Menino Jesus.'
    }
  ],
  'Mistérios Dolorosos': [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Christ_in_the_Wilderness_-_Ivan_Kramskoy_-_Google_Cultural_Institute.jpg/1024px-Christ_in_the_Wilderness_-_Ivan_Kramskoy_-_Google_Cultural_Institute.jpg',
      title: 'Cristo no Deserto',
      artist: 'Ivan Kramskoy',
      description: 'Jesus em jejum e oração no deserto.'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Andrea_Mantegna_038.jpg/1024px-Andrea_Mantegna_038.jpg',
      title: 'Agonia no Horto',
      artist: 'Andrea Mantegna',
      description: 'Jesus reza no Getsêmani antes de Sua Paixão.'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/The_Taking_of_Christ-Caravaggio_%28c.1602%29.jpg/1024px-The_Taking_of_Christ-Caravaggio_%28c.1602%29.jpg',
      title: 'A Prisão de Cristo',
      artist: 'Caravaggio',
      description: 'Cristo é levado pelos soldados no Horto.'
    }
  ],
  'Mistérios Gloriosos': [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Giotto_-_Scrovegni_---40---_Pentecost.jpg/1024px-Giotto_-_Scrovegni_---40---_Pentecost.jpg',
      title: 'Pentecostes',
      artist: 'Giotto',
      description: 'A descida do Espírito Santo sobre Maria e os Apóstolos.'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Tintoretto_Assunzione_della_Vergine_I_Frari.JPG/1024px-Tintoretto_Assunzione_della_Vergine_I_Frari.JPG',
      title: 'A Assunção de Maria',
      artist: 'Tintoretto',
      description: 'Maria elevada aos céus pelos anjos.'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/The_Resurrection_of_Christ_%28Noel_Coypel%29.JPG/1024px-The_Resurrection_of_Christ_%28Noel_Coypel%29.JPG',
      title: 'A Ressurreição',
      artist: 'Noël Coypel',
      description: 'A vitória de Cristo sobre a morte.'
    }
  ],
  'Mistérios Luminosos': [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Wedding_Feast_at_Cana_by_Paolo_Veronese.jpg/1024px-The_Wedding_Feast_at_Cana_by_Paolo_Veronese.jpg',
      title: 'As Bodas de Caná',
      artist: 'Paolo Veronese',
      description: 'O primeiro milagre de Jesus.'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Cima_da_Conegliano%2C_Baptism_of_Christ.jpg/1024px-Cima_da_Conegliano%2C_Baptism_of_Christ.jpg',
      title: 'O Batismo de Cristo',
      artist: 'Cima da Conegliano',
      description: 'Jesus sendo batizado por São João Batista.'
    }
  ]
};



export function getMysteryArtList(mysteryName: string): Artwork[] {
  return MYSTERY_ART_DATA[mysteryName] || MYSTERY_ART_DATA['Mistérios Gozosos'];
}

export async function getDailyArtImage(mysteryName: string, dateStr: string): Promise<Artwork> {
  const options = getMysteryArtList(mysteryName);
  
  // Use date and HOUR to change images throughout the day
  const hour = new Date().getHours();
  const seed = `${dateStr}-${hour}`;
  
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % options.length;
  
  return options[index];
}





