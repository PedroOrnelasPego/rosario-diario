export interface Artwork {
  url: string;
  title: string;
  artist?: string;
  description?: string;
}

const MYSTERY_ART_DATA: Record<string, Artwork[]> = {
  'Mistérios Gozosos': [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Angelico%2C_prado.jpg/640px-Angelico%2C_prado.jpg',
      title: 'A Anunciação (1425–1426)',
      artist: 'Fra Angelico',
      description: 'O Arcanjo Gabriel anuncia a Maria que ela será a Mãe do Salvador.'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Pontormo%2C_Visitation%2C_1516%2C_SS_Annunziata%2C_Chiostrino_dei_Voti%2C_Florence.jpg/960px-Pontormo%2C_Visitation%2C_1516%2C_SS_Annunziata%2C_Chiostrino_dei_Voti%2C_Florence.jpg',
      title: 'A Visitação (1516)',
      artist: 'Jacopo Pontormo',
      description: 'Maria visita sua prima Isabel.'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Leonardo_da_Vinci_-_The_Virgin_of_the_Rocks_-_KMS3238_-_Statens_Museum_for_Kunst.jpg/640px-Leonardo_da_Vinci_-_The_Virgin_of_the_Rocks_-_KMS3238_-_Statens_Museum_for_Kunst.jpg',
      title: 'A Virgem das Rochas (1483–1486)',
      artist: 'Leonardo da Vinci',
      description: 'A Sagrada Família em um momento de ternura.'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Andrea_Mantegna_-_The_Presentation_-_Google_Art_Project.jpg/640px-Andrea_Mantegna_-_The_Presentation_-_Google_Art_Project.jpg',
      title: 'A Apresentação no Templo (c. 1454)',
      artist: 'Andrea Mantegna',
      description: 'Jesus é apresentado ao Senhor no Templo.'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Adora%C3%A7%C3%A3o_dos_Reis_Magos_-_Sao_Bento.jpg/640px-Adora%C3%A7%C3%A3o_dos_Reis_Magos_-_Sao_Bento.jpg',
      title: 'Adoração dos Reis Magos',
      artist: 'Gregório Lopes',
    }
  ],
  'Mistérios Dolorosos': [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Caravaggio%2C_flagellazione_di_cristo%2C_1610_ca.%2C_da_s._domenico_maggiore_03.JPG/640px-Caravaggio%2C_flagellazione_di_cristo%2C_1610_ca.%2C_da_s._domenico_maggiore_03.JPG',
      title: 'A Flagelação de Cristo (1606-1610)',
      artist: 'Caravaggio',
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Titian_-_Christ_crowned_with_Thorns_-_Louvre.jpg/960px-Titian_-_Christ_crowned_with_Thorns_-_Louvre.jpg',
      title: 'A Coroação de Espinhos (1542-1543)',
      artist: 'Titian',
      description: 'A humilhação de Cristo antes da Crucifixão.'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Cristo_abrazado_a_la_cruz_El_Greco.jpg/500px-Cristo_abrazado_a_la_cruz_El_Greco.jpg?_=20080921111956',
      title: 'Cristo Carregando a Cruz (c. 1580)',
      artist: 'El Greco',
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Michelangelo%27s_Pieta_5450_cropncleaned_edit.jpg/960px-Michelangelo%27s_Pieta_5450_cropncleaned_edit.jpg',
      title: 'Pietà (1498–1499)',
      artist: 'Michelangelo',
      description: 'Maria segura o corpo de Jesus após a descida da cruz.'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Pietro_Perugino_cat40.jpg/640px-Pietro_Perugino_cat40.jpg',
      title: 'Lamentação sobre Cristo Morto (1495)',
      artist: 'Pietro Perugino',
      description: 'O luto sobre o corpo do Salvador.'
    }
  ],
  'Mistérios Gloriosos': [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Resurrection_%28Piero_della_Francesca%29.jpeg',
      title: 'A Ressurreição (1463–1465)',
      artist: 'Piero della Francesca',
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Stefano_Marucelli%2C_ascensione_di_cristo_02.jpg/640px-Stefano_Marucelli%2C_ascensione_di_cristo_02.jpg',
      title: 'A Ascensão de Cristo (1510-1520)',
      artist: 'Stefano Marucelli',
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Maino_Pentecost%C3%A9s%2C_1620-1625._Museo_del_Prado.jpg/640px-Maino_Pentecost%C3%A9s%2C_1620-1625._Museo_del_Prado.jpg',
      title: 'Pentecostes (1620-1625)',
      artist: 'Juan Bautista Maino',
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Mestres_do_Sardoal_Assun%C3%A7%C3%A3o_da_Virgem_s%C3%A9c_XVI_168_x_135_cm.jpg/640px-Mestres_do_Sardoal_Assun%C3%A7%C3%A3o_da_Virgem_s%C3%A9c_XVI_168_x_135_cm.jpg',
      title: 'Assunção da Virgem (século XVI)',
      artist: 'Vicente Gil',
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Diego_Vel%C3%A1zquez_-_Coronation_of_the_Virgin_-_Prado.jpg/640px-Diego_Vel%C3%A1zquez_-_Coronation_of_the_Virgin_-_Prado.jpg',
      title: 'Coroação da Virgem (c. 1641–1642)',
      artist: 'Diego Velázquez',
    }
  ],
  'Mistérios Luminosos': [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/The_Baptism_of_Christ_%28Verrocchio_%26_Leonardo%29.jpg/640px-The_Baptism_of_Christ_%28Verrocchio_%26_Leonardo%29.jpg',
      title: 'O Batismo de Cristo (c. 1448–1450)',
      artist: 'Andrea del Verrocchio e Leonardo da Vinci',
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Paolo_Veronese_008.jpg/960px-Paolo_Veronese_008.jpg',
      title: 'As Bodas de Caná (1563)',
      artist: 'Paolo Veronese',
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Transfigurazione_%28Raffaello%29_September_2015-1a.jpg/640px-Transfigurazione_%28Raffaello%29_September_2015-1a.jpg',
      title: 'A Transfiguração (1516–1520)',
      artist: 'Raphael',
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/The_last_supper_2.jpg/960px-The_last_supper_2.jpg',
      title: 'A Última Ceia (1495-1498)',
      artist: 'Leonardo da Vinci',
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Grablegung_Christi_%281516%29_-_Fra_Bartolomeo_%28Palazzo_Pitti%2C_Florence%29.jpg/640px-Grablegung_Christi_%281516%29_-_Fra_Bartolomeo_%28Palazzo_Pitti%2C_Florence%29.jpg',
      title: 'Sepultamento de Cristo (1516)',
      artist: 'Fra Bartolomeo',
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
