export interface BibleVerse {
  text: string;
  reference: string;
}

export async function getDailyVerse(): Promise<BibleVerse> {
  try {
    // We use a fixed set of verses or a random one for better reliability
    // But since the user asked for the API, let's try to fetch a common one first
    // Defaulting to a beautiful verse if API fails
    const defaultVerses = [
      { text: "Pois onde estiver o vosso tesouro, ali estará também o vosso coração.", reference: "Lucas 12:34" },
      { text: "O Senhor é o meu pastor, nada me faltará.", reference: "Salmos 23:1" },
      { text: "Tudo posso naquele que me fortalece.", reference: "Filipenses 4:13" },
      { text: "Deixai vir a mim as criancinhas e não as impeçais, porque o Reino de Deus é daqueles que se lhes assemelham.", reference: "Marcos 10:14" },
      { text: "Amarás o teu próximo como a ti mesmo.", reference: "Mateus 22:39" }
    ];

    const response = await fetch('https://bible-api.com/john+3:16?translation=almeida');
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    return {
      text: data.text.trim(),
      reference: data.reference
    };
  } catch (error) {
    // Fallback to random default verse
    const defaultVerses = [
      { text: "Pois onde estiver o vosso tesouro, ali estará também o vosso coração.", reference: "Lucas 12:34" },
      { text: "O Senhor é o meu pastor, nada me faltará.", reference: "Salmos 23:1" },
      { text: "Tudo posso naquele que me fortalece.", reference: "Filipenses 4:13" },
      { text: "Deixai vir a mim as criancinhas e não as impeçais, porque o Reino de Deus é daqueles que se lhes assemelham.", reference: "Marcos 10:14" },
    ];
    return defaultVerses[Math.floor(Math.random() * defaultVerses.length)];
  }
}
