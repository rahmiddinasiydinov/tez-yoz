export interface TypingStats {
  wpm: number
  accuracy: number
  errors: number
  correctChars: number
  totalChars: number
  timeElapsed: number
}

export interface TestResult extends TypingStats {
  testType: "time" | "words"
  testValue: number
  language: string
  completedAt: string
}

export const calculateWPM = (correctChars: number, timeInSeconds: number): number => {
  if (timeInSeconds === 0) return 0
  // Standard WPM calculation: (characters / 5) / (time in minutes)
  return Math.round(correctChars / 5 / (timeInSeconds / 60))
}

export const calculateAccuracy = (correctChars: number, totalChars: number): number => {
  if (totalChars === 0) return 100
  return Math.round((correctChars / totalChars) * 100)
}

export const getTextSamples = (language: string): string[] => {
  const samples = {
    uzbek: [
      "Tez jigarrang tulki dangasa itning ustidan sakraydi. Bu jumla barcha harflarni o'z ichiga oladi va yozish mashqi uchun juda mos keladi.",
      "Texnologiya bizning muloqot qilish, ishlash va yashash uslubimizni tubdan o'zgartirdi. Smartfonlardan sun'iy intellektgacha innovatsiyalar kelajagimizni shakllantirishda davom etmoqda.",
      "Kitob o'qish bilimimiz va tasavvurimizni kengaytiradi. Adabiyot bizni turli dunyolarga olib boradi va turli nuqtai nazarlarni tushunishga yordam beradi.",
      "Jismoniy mashqlar sog'liq uchun juda muhimdir. Muntazam sport mashqlari mushaklarni mustahkamlaydi va ruhiy holatni yaxshilaydi.",
      "Oshpazlik san'at ham, fan ham hisoblanadi. Ingredientlar, texnikalar va ijodkorlikning uyg'unligi mazali taomlar yaratishga olib keladi.",
      "O'zbekiston boy madaniyat va tarixga ega mamlakat. Ipak yo'li orqali turli xalqlar madaniyatlari bu yerda uchrashar edi.",
      "Ta'lim har bir insonning asosiy huquqidir. Bilim olish orqali biz o'z imkoniyatlarimizni ro'yobga chiqaramiz va jamiyatga hissa qo'shamiz.",
    ],
    english: [
      "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once, making it perfect for typing practice.",
      "Technology has revolutionized the way we communicate, work, and live. From smartphones to artificial intelligence, innovation continues to shape our future.",
      "Reading books expands our knowledge and imagination. Literature transports us to different worlds and helps us understand diverse perspectives and cultures.",
      "Exercise is essential for maintaining good health. Regular physical activity strengthens muscles, improves cardiovascular health, and boosts mental wellbeing.",
      "Cooking is both an art and a science. The combination of ingredients, techniques, and creativity results in delicious meals that bring people together.",
    ],
    russian: [
      "Съешь же ещё этих мягких французских булок да выпей чаю. Широкая электрификация южных губерний даст мощный толчок подъёму сельского хозяйства.",
      "Технологии кардинально изменили способы общения и работы. Цифровые инновации продолжают трансформировать современный мир.",
      "Чтение книг расширяет наши знания и воображение. Литература переносит нас в разные миры и помогает понять различные культуры.",
      "Физические упражнения необходимы для поддержания здоровья. Регулярная активность укрепляет мышцы и улучшает самочувствие.",
      "Кулинария - это искусство и наука одновременно. Сочетание ингредиентов и техник создаёт восхитительные блюда.",
    ],
    spanish: [
      "El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón detrás del palenque de paja.",
      "La tecnología ha transformado nuestra forma de comunicarnos y trabajar. Las innovaciones digitales continúan cambiando el mundo moderno.",
      "Los libros nos permiten viajar a mundos imaginarios y aprender sobre diferentes culturas. La lectura enriquece nuestra mente y vocabulario.",
    ],
    french: [
      "Portez ce vieux whisky au juge blond qui fume sur son île intérieure, dans un kiosque de banlieue.",
      "La technologie moderne facilite la communication entre les personnes du monde entier. Internet connecte les cultures diverses.",
      "La cuisine française est réputée pour sa sophistication et ses saveurs délicates. Chaque région a ses spécialités culinaires uniques.",
    ],
    german: [
      "Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich.",
      "Die deutsche Sprache hat eine reiche Geschichte und Literatur. Viele berühmte Dichter und Denker haben auf Deutsch geschrieben.",
      "Deutschland ist bekannt für seine Ingenieurskunst und Präzision. Die deutsche Automobilindustrie ist weltweit führend.",
    ],
  }

  return samples[language as keyof typeof samples] || samples.uzbek
}

export const getRandomText = (language: string, wordCount?: number): string => {
  const samples = getTextSamples(language)

  if (wordCount) {
    // For word-based tests, generate exactly the requested number of words
    let result = ""
    let currentWords = 0

    while (currentWords < wordCount) {
      const randomSample = samples[Math.floor(Math.random() * samples.length)]
      const words = randomSample.split(" ")

      for (const word of words) {
        if (currentWords >= wordCount) break
        result += (currentWords > 0 ? " " : "") + word
        currentWords++
      }
    }

    return result
  }

  // For time-based tests, generate longer text by combining multiple samples
  const numSamples = Math.floor(Math.random() * 3) + 2 // 2-4 samples
  let combinedText = ""

  for (let i = 0; i < numSamples; i++) {
    const randomSample = samples[Math.floor(Math.random() * samples.length)]
    combinedText += (i > 0 ? " " : "") + randomSample
  }

  return combinedText
}

export const generateAdditionalText = (language: string, currentText: string, minLength = 200): string => {
  const samples = getTextSamples(language)
  let additionalText = currentText

  while (additionalText.length < minLength) {
    const randomSample = samples[Math.floor(Math.random() * samples.length)]
    additionalText += " " + randomSample
  }

  return additionalText
}
