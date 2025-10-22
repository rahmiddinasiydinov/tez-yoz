"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import safeStorage from "./safe-storage"

type Language = "uz" | "en" | "ru"

interface Translations {
  // Signup & Login 
  welcomeBack: string,
  signInToTrack: string,
  enterYourEmail: string,
  enterYourPassword: string,
  signin: string,
  dontHaveAnAccount: string,
  signingIn: string,
  joinTheCommunity: string,
  createAccountToSave: string,
  chooseUsername: string,
  createPassword: string,
  confirmYourPassword: string,
  verifyYourEmail: string,
  verificationCode: string,
  enterVerificationCode: string,
  weSentCodeToEmail: string,
  enterItBelowToVerify: string,
  verify: string,
  creatingAccount: string,
  verifying: string,
  loginFailed: string,
  signupFailed: string,
  verificationFailed: string,
  loggedOut: string,
  errorHappenedWhileLoggingOut: string,
  registered: string,
  loggedIn: string,
  pleaseLoginToSaveResults: string,
  unexpectedErrorOccurred: string,
  invalidEmailOrPassword: string,
  userAlreadyExists: string,
  // Navigation
  test: string
  leaderboard: string
  settings: string
  profile: string
  login: string
  signup: string
  signOut: string
  viewProfile: string

  //Loading
  loading: string,
  checkingAuthentication: string,

  //Profile
  yourProfile: string,
  trackYourTyping: string,
  pleaseLogin: string,
  joined: string,
  statisticsOverview: string,
  testHistory: string,
  noTestData: string
  completeSomeTyping: string
  testsCompletedProfile: string
  averageWPM: string
  wpmProgress: string
  accuracyProgress: string
  performanceMetrics: string
  consistencyScore: string
  improvementRate: string
  wpmPerDay: string
  languages: string
  testTypes: string
  notTestingHistory: string
  yourCompletedTyping: string,
  testHistoryResults: string,
  exportCSV: string,
  allLanguages: string,
  allTypes: string,
  date: string

  // Test Interface
  pageTitle: string
  pageDescription: string
  startTyping: string
  timeLeft: string
  wpm: string
  accuracy: string
  errors: string
  words: string
  restart: string
  testComplete: string
  reset: string
  time: string
  progress: string
  seconds: string
  clickToStart: string
  startTypingInstruction: string
  typingInstruction: string

  // Settings
  testType: string
  timeMode: string
  wordMode: string
  language: string
  theme: string
  interfaceLanguage: string
  darkMode: string
  lightMode: string
  systemMode: string
  customizeTyping: string
  display: string,
  showRealTimeTyping: string,
  soundEffects: string,
  keystrokeSounds: string,
  resetSettings: string,
  restoreDefaults: string,
  liveWPM: string,
  totalTime: string
  totalChars: string
  settingsUpdated: string
  settingsReset: string

  // Results
  wordsPerMinute: string
  totalWords: string
  totalErrors: string
  finalAccuracy: string
  testDuration: string
  consistency: string
  hereAreResults: string
  globalRanking: string
  outOfAllPlayers: string
  best: string
  testsCompleted: string
  viewLeaderboard: string
  detailedStatistics: string
  correctCharacters: string
  totalCharacters: string
  completedAt: string
  tryAgain: string
  shareResults: string
  tipsToImprove: string
  focusOnAccuracy: string
  practiceTouchTyping: string
  takeYourTime: string
  regularPractice: string
  tryDifferentLanguages: string
  checkLeaderboard: string

  // Ratings
  excellent: string
  good: string
  average: string
  needsPractice: string
  perfect: string
  needsWork: string

  // Auth
  username: string
  email: string
  password: string
  confirmPassword: string
  createAccount: string
  signInToAccount: string
  alreadyHaveAccount: string
  dontHaveAccount: string

  // Leaderboard
  globalLeaderboard: string
  rank: string
  user: string
  bestWpm: string
  avgAccuracy: string
  topTypists: string
  seeHowYouRank: string
  leaderboardFilters: string
  category: string
  timePeriod: string
  rankings: string
  competitors: string
  noRankingsYet: string
  completeTestsToAppear: string
  you: string
  avg: string
  loginRequired: string
  signInToSeeRanking: string
  noRankingYet: string
  completeTestsToGetRanked: string
  yourCurrentRanking: string
  in: string
  averageAccuracy: string
  testsDone: string
  waysToImproveYourRanking: string
  practiceRegularlyToImproveConsistency: string
  completeMoreTestsToEstablishBetterAverage: string
  workOnConsistency: string
  tryDifferentLanguagesAndTestTypes: string
  challengeYourselfWithLongerTests: string
  tests: string
  yourRanking: string

  // Others
  couldntSendResults: string,
  resultSuccessfullySaved: string,
  testModeNotFound: string,
  errorInFetchingGameModeDate: string,
  sorryWeCouldntSaveResults: string,
  resultIsBeingSaved: string,
  // Languages
  "language.uzbek": string
  "language.english": string
  "language.russian": string
  "language.spanish": string
  "language.french": string
  "language.german": string
}

const translations: Record<Language, Translations> = {
  uz: {
    // Signup & Login
    welcomeBack: "Qaytganingizdan xursandmiz!",
    signInToTrack: "Yozish tezligingizni kuzatishni boshlash uchun tizimga kiring",
    enterYourEmail: "Emailingizni kiriting",
    enterYourPassword: "Parolingizni kiriting",
    signin: "Kirish",
    dontHaveAnAccount: "Hisobingiz yo'qmi?",
    signingIn: "Kirilmoqda...",
    joinTheCommunity: "Jamoamizga qo'shiling",
    createAccountToSave: "Yozish natijalaringizni saqlash uchun hisob yarating",
    chooseUsername: "Foydalanuvchi nomini tanlang",
    createPassword: "Parol yarating",
    confirmYourPassword: "Parolingizni tasdiqlang",
    verifyYourEmail: "Emailingizni tasdiqlang",
    verificationCode: "Tasdiqlash kodi",
    enterVerificationCode: "Tasdiqlash kodini kiriting",
    weSentCodeToEmail: "Biz tasdiqlash kodini quyidagi emailingizga yubordik",
    enterItBelowToVerify: "Tasdiqlash uchun uni quyida kiriting",
    verify: "Tasdiqlash",
    creatingAccount: "Hisob yaratilmoqda...",
    verifying: "Ko'rib chiqilmoqda...",
    loginFailed: "Kirish muvaffaqiyatsiz.",
    signupFailed: "Ro'yxatdan o'tish muvaffaqiyatsiz.",
    verificationFailed: "Tasdiqlash muvaffaqiyatsiz.",
    errorHappenedWhileLoggingOut: "Chiqish paytida xatolik yuz berdi.",
    loggedOut: "Tizimdan chiqdingiz!",
    registered: "Ro'yxatdan o'tdingiz!",
    loggedIn: "Tizimga kirdingiz!",
    pleaseLoginToSaveResults: "Natijalarni saqlash uchun tizimga kiring!",
    unexpectedErrorOccurred: "Kutilmagan xatolik yuz berdi.",
    invalidEmailOrPassword: "Email yoki parol noto‘g‘ri.",
    userAlreadyExists: "Foydalanuvchi allaqachon mavjud.",

    // Navigation
    test: "Test",
    leaderboard: "Reyting",
    settings: "Sozlamalar",
    profile: "Profil",
    login: "Kirish",
    signup: "Ro'yxatdan o'tish",
    signOut: "Chiqish",
    viewProfile: "Profilni ko'rish",

    //Loading
    loading: "Yuklanmoqda...",
    checkingAuthentication: "Autentifikatsiya holati tekshirilmoqda",

    //Profile
    yourProfile: "Profilingiz",
    trackYourTyping: "Yozishdagi yutuqlaringiz va rivojlanishingizni kuzatib boring",
    pleaseLogin: "Profilingizni ko‘rish uchun tizimga kiring",
    joined: "Qo‘shilgan sana",
    statisticsOverview: "Statistikaga umumiy nazar",
    testHistory: "Test tarixi",
    noTestData: "Hali test ma'lumotlari yo‘q",
    completeSomeTyping: "Batafsil statistikani ko‘rish uchun bir nechta matn terish testlarini bajaring.",
    testsCompletedProfile: "Bajarilgan testlar",
    averageWPM: "O‘rtacha So‘z/Daq",
    wpmProgress: "So‘z/Daq rivoji",
    accuracyProgress: "Aniqlik rivoji",
    performanceMetrics: "Natijalar ko‘rsatkichlari",
    consistencyScore: "Barqarorlik bahosi",
    improvementRate: "O‘sish sur’ati",
    wpmPerDay: "So‘z/Daq kuniga",
    languages: "Tillar",
    testTypes: "Test turlari",
    notTestingHistory: "Test tarixi yo‘q",
    yourCompletedTyping: "Bajargan matn terish testlaringiz shu yerda ko‘rinadi.",
    testHistoryResults: "Test tarixi natijalari",
    exportCSV: "CSV'ni eksport qilish",
    allLanguages: "Barcha tillar",
    allTypes: "Barcha turlar",
    date: "Sana",

    // Test Interface
    pageTitle: "Tezligingizni Sinab Ko‘ring",
    pageDescription: "Matn terish tezligingizni tekshiring va reytingda yuqoriga ko‘tariling!",
    startTyping: "Yozishni boshlang...",
    timeLeft: "Qolgan vaqt",
    wpm: "So'z/daq",
    accuracy: "Aniqlik",
    errors: "Xatolar",
    words: "So'zlar",
    restart: "Qayta boshlash",
    testComplete: "Test tugadi!",
    reset: "Qayta o'rnatish",
    time: "Vaqt",
    progress: "Jarayon",
    seconds: "soniya",
    clickToStart: "Yozishni boshlash uchun matn maydonini bosing",
    startTypingInstruction: "Birinchi harfni bosganingizda test avtomatik boshlanadi",
    typingInstruction: "Yuqoridagi matnni imkon qadar tez va aniq yozing",

    // Settings
    testType: "Test turi",
    timeMode: "Vaqt rejimi",
    wordMode: "So'z rejimi",
    language: "Matn tili",
    theme: "Mavzu",
    interfaceLanguage: "Interfeys tili",
    darkMode: "Qorong'u",
    lightMode: "Yorug'",
    systemMode: "Tizim",
    customizeTyping: "Yozish tajribangizni sozlang",
    display: "Ko‘rinish",
    showRealTimeTyping: "Matn terish tezligini real vaqtda ko‘rsatish",
    soundEffects: "Ovoz effektlari",
    keystrokeSounds: "Tugma bosish va yakunlash ovozlari",
    resetSettings: "Sozlamalarni tiklash",
    restoreDefaults: "Standart sozlamalarni tiklash",
    liveWPM: "Jonli So'z/Daq",
    totalTime: "Umumiy vaqt",
    totalChars: "Umumiy belgilar",
    settingsUpdated: "Sozlamalar yangilandi!",
    settingsReset: "Sozlamalar standart holatga tiklandi!",

    // Results
    wordsPerMinute: "Daqiqada so'zlar",
    totalWords: "Jami so'zlar",
    totalErrors: "Jami xatolar",
    finalAccuracy: "Yakuniy aniqlik",
    testDuration: "Test davomiyligi",
    consistency: "Barqarorlik",
    hereAreResults: "Sizning natijalaringiz",
    globalRanking: "Global reyting",
    outOfAllPlayers: "barcha o'yinchilar orasida",
    best: "eng yaxshi",
    testsCompleted: "tugallangan testlar",
    viewLeaderboard: "Reytingni ko'rish",
    detailedStatistics: "Batafsil statistika",
    correctCharacters: "To'g'ri belgilar",
    totalCharacters: "Jami belgilar",
    completedAt: "Tugallangan:",
    tryAgain: "Qayta urinish",
    shareResults: "Natijalarni ulashish",
    tipsToImprove: "Yaxshilash bo'yicha maslahatlar",
    focusOnAccuracy: "Avval aniqlikka e'tibor bering - tezlik amaliyot bilan keladi",
    practiceTouchTyping: "Tezligingizni oshirish uchun ko'r yozishni mashq qiling",
    takeYourTime: "Shoshilmang va qiyin so'zlarni ikki marta tekshiring",
    regularPractice: "Muntazam mashq qilish - yozish mahoratingizni oshirishning kaliti",
    tryDifferentLanguages: "Turli tillar va matn turlarini sinab ko'ring",
    checkLeaderboard: "Boshqalar bilan qanday taqqoslashingizni ko'rish uchun reytingni tekshiring",

    // Ratings
    excellent: "A'lo",
    good: "Yaxshi",
    average: "O'rtacha",
    needsPractice: "Mashq kerak",
    perfect: "Mukammal",
    needsWork: "Yaxshilash kerak",

    // Auth
    username: "Foydalanuvchi nomi",
    email: "Email",
    password: "Parol",
    confirmPassword: "Parolni tasdiqlang",
    createAccount: "Hisob yaratish",
    signInToAccount: "Hisobga kirish",
    alreadyHaveAccount: "Hisobingiz bormi?",
    dontHaveAccount: "Hisobingiz yo'qmi?",

    // Leaderboard
    globalLeaderboard: "Global reyting",
    rank: "O'rin",
    user: "Foydalanuvchi",
    bestWpm: "Eng yaxshi WPM",
    avgAccuracy: "O'rtacha aniqlik",
    topTypists: "Eng yaxshi yozuvchilar",
    seeHowYouRank: "Boshqalar bilan qanday taqqoslashingizni ko'ring",
    leaderboardFilters: "Reyting filtrlari",
    category: "Kategoriya",
    timePeriod: "Vaqt davri",
    rankings: "reytinglar",
    competitors: "raqobatchilar",
    noRankingsYet: "Hali reytinglar yo'q",
    completeTestsToAppear: "Reytingda ko'rinish uchun testlarni tugallang!",
    you: "Siz",
    avg: "O'rtacha",
    loginRequired: "Kirish talab qilinadi",
    signInToSeeRanking: "Shaxsiy reytingingizni ko'rish va boshqalar bilan raqobatlashish uchun kiring!",
    noRankingYet: "Hali reyting yo'q",
    completeTestsToGetRanked: "Reytingga kirish uchun joriy filtrlar bilan testlarni tugallang!",
    yourCurrentRanking: "Sizning joriy reytingingiz",
    in: "da",
    averageAccuracy: "O'rtacha aniqlik",
    testsDone: "Tugallangan testlar",
    waysToImproveYourRanking: "Reytingingizni yaxshilash yo'llari",
    practiceRegularlyToImproveConsistency:
      "Barqarorlikni yaxshilash va reytingda ko'tarilish uchun muntazam mashq qiling",
    completeMoreTestsToEstablishBetterAverage:
      "Yaxshiroq o'rtacha ko'rsatkich va reyting o'rnatish uchun ko'proq testlarni tugallang",
    workOnConsistency: "Barqarorlik ustida ishlang - testlar bo'ylab barqaror natijalarni saqlashga harakat qiling",
    tryDifferentLanguagesAndTestTypes:
      "Kuchli tomonlaringizni topish uchun turli tillar va test turlarini sinab ko'ring",
    challengeYourselfWithLongerTests: "Chidamlilikni oshirish uchun uzunroq testlar bilan o'zingizni sinang",
    tests: "testlar",
    yourRanking: "Sizning reytingingiz",

    //Others
    couldntSendResults: "Natijalarni yuborib bo'lmadi",
    resultSuccessfullySaved: "Natijalar muvaffaqiyatli saqlandi!",
    testModeNotFound: "Test rejimi topilmadi",
    errorInFetchingGameModeDate: "O'yin rejimi ma'lumotlarini olishda xatolik yuz berdi",
    sorryWeCouldntSaveResults: "Kechirasiz, natijalarni saqlab bo'lmadi",
    resultIsBeingSaved: "Natijalar saqlanmoqda...",

    // Languages
    "language.uzbek": "O'zbek",
    "language.english": "Ingliz",
    "language.russian": "Rus",
    "language.spanish": "Ispan",
    "language.french": "Fransuz",
    "language.german": "Nemis",
  },
  en: {
    // Signup & Login
    welcomeBack: "Welcome back!",
    signInToTrack: "Sign in to track your progress",
    enterYourEmail: "Enter your email",
    enterYourPassword: "Enter your password",
    signin: "Sign In",
    dontHaveAnAccount: "Don't have an account?",
    signingIn: "Signing in...",
    joinTheCommunity: "Join the Community",
    createAccountToSave: "Create an account to save your results",
    chooseUsername: "Choose a username",
    createPassword: "Create a password",
    confirmYourPassword: "Confirm your password",
    verifyYourEmail: "Verify your email",
    verificationCode: "Verification code",
    enterVerificationCode: "Enter the verification code",
    weSentCodeToEmail: "We sent a verification code to your email",
    enterItBelowToVerify: "Enter it below to verify",
    verify: "Verify",
    creatingAccount: "Creating account...",
    verifying: "Verifying...",
    loginFailed: "Login failed.",
    signupFailed: "Signup failed.",
    verificationFailed: "Verification failed.",
    errorHappenedWhileLoggingOut: "An error occurred while logging out.",
    loggedOut: "Logged out!",
    registered: "You have registered!",
    loggedIn: "Logged in!",
    pleaseLoginToSaveResults: "Please log in to save your results!",
    unexpectedErrorOccurred: "An unexpected error occurred.",
    invalidEmailOrPassword: "Invalid email or password.",
    userAlreadyExists: "User already exists.",
    // Navigation
    test: "Test",
    leaderboard: "Leaderboard",
    settings: "Settings",
    profile: "Profile",
    login: "Login",
    signup: "Sign Up",
    signOut: "Sign Out",
    viewProfile: "View Profile",

    //Loading
    loading: 'Loading...',
    checkingAuthentication: "Checking authentication status",

    //Profile
    yourProfile: "Your Profile",
    trackYourTyping: "Track your typing progress and achievements",
    pleaseLogin: "Please log in to view your profile",
    joined: 'Joined',
    statisticsOverview: "Statistics Overview",
    testHistory: " Test History",
    noTestData: "No Test Data Yet",
    completeSomeTyping: "Complete some typing tests to see your detailed statistics here.",
    testsCompletedProfile: "Tests Completed",
    averageWPM: "Average WPM",
    wpmProgress: "WPM Progress",
    accuracyProgress: "Accuracy Progress",
    performanceMetrics: "Performance Metrics",
    consistencyScore: "Consistency Score",
    improvementRate: "Improvement Rate",
    wpmPerDay: "WPM/day",
    languages: "Languages",
    testTypes: "  Test Types",
    notTestingHistory: "No Test History",
    yourCompletedTyping: "Your completed typing tests will appear here.",
    testHistoryResults: "Test History Results",
    exportCSV: " Export CSV",
    allLanguages: "All Languages",
    allTypes: "All Types",
    date: "Date",

    // Test Interface
    pageTitle: "Type to Unlock Your Speed",
    pageDescription: "Test your typing speed and climb the leaderboard!",
    startTyping: "Start typing...",
    timeLeft: "Time left",
    wpm: "WPM",
    accuracy: "Accuracy",
    errors: "Errors",
    words: "Words",
    restart: "Restart",
    testComplete: "Test Complete!",
    reset: "Reset",
    time: "Time",
    progress: "Progress",
    seconds: "seconds",
    clickToStart: "Click on the text area to start",
    startTypingInstruction: "Test will start automatically when you type the first character",
    typingInstruction: "Type the text above as accurately and quickly as possible",

    // Settings
    testType: "Test Type",
    timeMode: "Time Mode",
    wordMode: "Word Mode",
    language: "Text Language",
    theme: "Theme",
    interfaceLanguage: "Interface Language",
    darkMode: "Dark",
    lightMode: "Light",
    systemMode: "System",
    customizeTyping: "Customize your typing experience",
    display: "Display",
    showRealTimeTyping: "Show real-time typing speed",
    soundEffects: "Sound Effects",
    keystrokeSounds: "Keystroke and completion sounds",
    resetSettings: "Reset Settings",
    restoreDefaults: "Restore defaults",
    liveWPM: "Live WPM",
    totalTime: "Total Time",
    totalChars: "Total Characters:",
    settingsUpdated: "Settings updated!",
    settingsReset: "Settings reset to default!",

    // Results
    wordsPerMinute: "Words Per Minute",
    totalWords: "Total Words",
    totalErrors: "Total Errors",
    finalAccuracy: "Final Accuracy",
    testDuration: "Test Duration",
    consistency: "Consistency",
    hereAreResults: "Here are your results",
    globalRanking: "Your Global Ranking",
    outOfAllPlayers: "out of all players",
    best: "best",
    testsCompleted: "tests completed",
    viewLeaderboard: "View Leaderboard",
    detailedStatistics: "Detailed Statistics",
    correctCharacters: "Correct Characters",
    totalCharacters: "Total Characters",
    completedAt: "Completed at",
    tryAgain: "Try Again",
    shareResults: "Share Results",
    tipsToImprove: "Tips to Improve",
    focusOnAccuracy: "Focus on accuracy first - speed will come naturally with practice",
    practiceTouchTyping: "Practice touch typing to improve your speed",
    takeYourTime: "Take your time and double-check difficult words",
    regularPractice: "Regular practice is key to improving your typing skills",
    tryDifferentLanguages: "Try different languages and text types to challenge yourself",
    checkLeaderboard: "Check the leaderboard to see how you compare with others",

    // Ratings
    excellent: "Excellent",
    good: "Good",
    average: "Average",
    needsPractice: "Needs Practice",
    perfect: "Perfect",
    needsWork: "Needs Work",

    // Auth
    username: "Username",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    createAccount: "Create Account",
    signInToAccount: "Sign In to Account",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",

    // Leaderboard
    globalLeaderboard: "Global Leaderboard",
    rank: "Rank",
    user: "User",
    bestWpm: "Best WPM",
    avgAccuracy: "Avg Accuracy",
    topTypists: "Top Typists",
    seeHowYouRank: "See how you rank against other users",
    leaderboardFilters: "Leaderboard Filters",
    category: "Category",
    timePeriod: "Time Period",
    rankings: "Rankings",
    competitors: "competitors",
    noRankingsYet: "No Rankings Yet",
    completeTestsToAppear: "Complete some typing tests to appear on the leaderboard!",
    you: "You",
    avg: "Avg",
    loginRequired: "Login Required",
    signInToSeeRanking: "Sign in to see your personal ranking and compete with others!",
    noRankingYet: "No Ranking Yet",
    completeTestsToGetRanked: "Complete some typing tests with the current filters to get ranked!",
    yourCurrentRanking: "Your Current Ranking",
    in: "in",
    averageAccuracy: "Average Accuracy",
    testsDone: "Tests Done",
    waysToImproveYourRanking: "Ways to Improve Your Ranking",
    practiceRegularlyToImproveConsistency: "Practice regularly to improve your consistency and climb the rankings",
    completeMoreTestsToEstablishBetterAverage: "Complete more tests to establish a better average and ranking",
    workOnConsistency: "Work on consistency - try to maintain steady performance across tests",
    tryDifferentLanguagesAndTestTypes: "Try different languages and test types to find your strengths",
    challengeYourselfWithLongerTests: "Challenge yourself with longer tests to build endurance",
    tests: "tests",
    yourRanking: "Your Ranking",

    //Others
    couldntSendResults: "Could not send results",
    resultSuccessfullySaved: "Result is successfully saved!",
    testModeNotFound: "Test mode is not found",
    errorInFetchingGameModeDate: "Error in fetching game mode data!",
    sorryWeCouldntSaveResults: "Sorry, we could not save result.",
    resultIsBeingSaved: "Result is being saved...",

    // Languages
    "language.uzbek": "Uzbek",
    "language.english": "English",
    "language.russian": "Russian",
    "language.spanish": "Spanish",
    "language.french": "French",
    "language.german": "German",
  },
  ru: {
    // Signup & Login
    welcomeBack: "С возвращением!",
    signInToTrack: "Войдите, чтобы отслеживать свой прогресс",
    enterYourEmail: "Введите ваш email",
    enterYourPassword: "Введите ваш пароль",
    signin: "Войти",
    dontHaveAnAccount: "Нет аккаунта?",
    signingIn: "Вход...",
    joinTheCommunity: "Присоединяйтесь к сообществу",
    createAccountToSave: "Создайте аккаунт, чтобы сохранять свои результаты",
    chooseUsername: "Выберите имя пользователя",
    createPassword: "Создайте пароль",
    confirmYourPassword: "Подтвердите ваш пароль",
    verifyYourEmail: "Подтвердите ваш email",
    verificationCode: "Код подтверждения",
    enterVerificationCode: "Введите код подтверждения",
    weSentCodeToEmail: "Мы отправили код подтверждения на ваш email",
    enterItBelowToVerify: "Введите его ниже для подтверждения",
    verify: "Подтвердить",
    creatingAccount: "Создание аккаунта...",
    verifying: "Подтверждение...",
    loginFailed: "Ошибка входа.",
    signupFailed: "Ошибка регистрации.",
    verificationFailed: "Ошибка подтверждения.",
    errorHappenedWhileLoggingOut: "Произошла ошибка при выходе из системы.",
    loggedOut: "Вы вышли из системы!",
    registered: "Вы зарегистрированы!",
    loggedIn: "Вы вошли в систему!",
    pleaseLoginToSaveResults: "Пожалуйста, войдите, чтобы сохранить ваши результаты!",
    unexpectedErrorOccurred: "Произошла непредвиденная ошибка.",
    invalidEmailOrPassword: "Неверный email или пароль.",
    userAlreadyExists: "Пользователь уже существует.",

    // Navigation
    test: "Тест",
    leaderboard: "Рейтинг",
    settings: "Настройки",
    profile: "Профиль",
    login: "Войти",
    signup: "Регистрация",
    signOut: "Выйти",
    viewProfile: "Посмотреть профиль",

    //Loading
    loading: "Загрузка...",
    checkingAuthentication: "Проверка статуса аутентификации",

    //Profilfe
    yourProfile: "Ваш профиль",
    trackYourTyping: "Отслеживайте свой прогресс и достижения в печати",
    pleaseLogin: "Войдите, чтобы просмотреть свой профиль",
    joined: "Присоединился",
    statisticsOverview: "Обзор статистики",
    testHistory: "История тестов",
    noTestData: "Нет данных о тестах",
    completeSomeTyping: "Пройдите несколько тестов печати, чтобы увидеть подробную статистику.",
    testsCompletedProfile: "Выполненные тесты",
    averageWPM: "Средний WPM",
    wpmProgress: "Прогресс WPM",
    accuracyProgress: "Прогресс точности",
    performanceMetrics: "Показатели эффективности",
    consistencyScore: "Оценка стабильности",
    improvementRate: "Темп улучшения",
    wpmPerDay: "WPM/день",
    languages: "Языки",
    testTypes: "Типы тестов",
    notTestingHistory: "История тестов пуста",
    yourCompletedTyping: "Ваши завершённые тесты по печати появятся здесь.",
    testHistoryResults: "Результаты истории тестов",
    exportCSV: "Экспорт CSV",
    allLanguages: "Все языки",
    allTypes: "Все типы",
    date: "Дата",



    // Test Interface
    pageTitle: "Проверь свою скорость печати",
    pageDescription: "Тестируй свою скорость и поднимайся в таблице лидеров!",
    startTyping: "Начните печатать...",
    timeLeft: "Осталось времени",
    wpm: "Слов/мин",
    accuracy: "Точность",
    errors: "Ошибки",
    words: "Слова",
    restart: "Перезапустить",
    testComplete: "Тест завершен!",
    reset: "Сброс",
    time: "Время",
    progress: "Прогресс",
    seconds: "секунд",
    clickToStart: "Нажмите на текстовое поле для начала",
    startTypingInstruction: "Тест начнется автоматически при вводе первого символа",
    typingInstruction: "Печатайте текст выше как можно точнее и быстрее",

    // Settings
    testType: "Тип теста",
    timeMode: "Режим времени",
    wordMode: "Режим слов",
    language: "Язык текста",
    theme: "Тема",
    interfaceLanguage: "Язык интерфейса",
    darkMode: "Темная",
    lightMode: "Светлая",
    systemMode: "Системная",
    customizeTyping: "Настрой свой опыт печати",
    display: "Отображение",
    showRealTimeTyping: "Показывать скорость печати в реальном времени",
    soundEffects: "Звуковые эффекты",
    keystrokeSounds: "Звуки нажатий и завершения",
    resetSettings: "Сбросить настройки",
    restoreDefaults: "Восстановить по умолчанию",
    liveWPM: "WPM в реальном времени",
    totalTime: "Общее время",
    totalChars: "Всего символов",
    settingsUpdated: "Настройки обновлены!",
    settingsReset: "Настройки сброшены по умолчанию!",


    // Results
    wordsPerMinute: "Слов в минуту",
    totalWords: "Всего слов",
    totalErrors: "Всего ошибок",
    finalAccuracy: "Итоговая точность",
    testDuration: "Длительность теста",
    consistency: "Стабильность",
    hereAreResults: "Вот ваши результаты",
    globalRanking: "Ваш глобальный рейтинг",
    outOfAllPlayers: "из всех игроков",
    best: "лучший",
    testsCompleted: "тестов завершено",
    viewLeaderboard: "Посмотреть рейтинг",
    detailedStatistics: "Подробная статистика",
    correctCharacters: "Правильные символы",
    totalCharacters: "Всего символов",
    completedAt: "Завершено в",
    tryAgain: "Попробовать снова",
    shareResults: "Поделиться результатами",
    tipsToImprove: "Советы по улучшению",
    focusOnAccuracy: "Сначала сосредоточьтесь на точности - скорость придет с практикой",
    practiceTouchTyping: "Практикуйте слепую печать для улучшения скорости",
    takeYourTime: "Не торопитесь и дважды проверяйте сложные слова",
    regularPractice: "Регулярная практика - ключ к улучшению навыков печати",
    tryDifferentLanguages: "Попробуйте разные языки и типы текстов для вызова",
    checkLeaderboard: "Проверьте рейтинг, чтобы сравнить себя с другими",

    // Ratings
    excellent: "Отлично",
    good: "Хорошо",
    average: "Средне",
    needsPractice: "Нужна практика",
    perfect: "Идеально",
    needsWork: "Нужно поработать",

    // Auth
    username: "Имя пользователя",
    email: "Email",
    password: "Пароль",
    confirmPassword: "Подтвердите пароль",
    createAccount: "Создать аккаунт",
    signInToAccount: "Войти в аккаунт",
    alreadyHaveAccount: "Уже есть аккаунт?",
    dontHaveAccount: "Нет аккаунта?",

    // Leaderboard
    globalLeaderboard: "Глобальный рейтинг",
    rank: "Место",
    user: "Пользователь",
    bestWpm: "Лучший WPM",
    avgAccuracy: "Средняя точность",
    topTypists: "Лучшие печатники",
    seeHowYouRank: "Посмотрите, как вы сравниваетесь с другими пользователями",
    leaderboardFilters: "Фильтры рейтинга",
    category: "Категория",
    timePeriod: "Период времени",
    rankings: "Рейтинги",
    competitors: "участников",
    noRankingsYet: "Рейтингов пока нет",
    completeTestsToAppear: "Пройдите несколько тестов печати, чтобы появиться в рейтинге!",
    you: "Вы",
    avg: "Сред",
    loginRequired: "Требуется вход",
    signInToSeeRanking: "Войдите, чтобы увидеть свой личный рейтинг и соревноваться с другими!",
    noRankingYet: "Рейтинга пока нет",
    completeTestsToGetRanked: "Пройдите несколько тестов с текущими фильтрами, чтобы получить рейтинг!",
    yourCurrentRanking: "Ваш текущий рейтинг",
    in: "в",
    averageAccuracy: "Средняя точность",
    testsDone: "Тестов пройдено",
    waysToImproveYourRanking: "Способы улучшить ваш рейтинг",
    practiceRegularlyToImproveConsistency: "Регулярно практикуйтесь для улучшения стабильности и подъема в рейтинге",
    completeMoreTestsToEstablishBetterAverage:
      "Пройдите больше тестов для установления лучшего среднего показателя и рейтинга",
    workOnConsistency: "Работайте над стабильностью - старайтесь поддерживать стабильную производительность в тестах",
    tryDifferentLanguagesAndTestTypes: "Попробуйте разные языки и типы тестов, чтобы найти свои сильные стороны",
    challengeYourselfWithLongerTests: "Бросьте себе вызов более длинными тестами для развития выносливости",
    tests: "тестов",
    yourRanking: "Ваш рейтинг",
    //Others
    couldntSendResults: "Не удалось отправить результаты",
    resultSuccessfullySaved: "Результат успешно сохранен!",
    testModeNotFound: "Режим теста не найден",
    errorInFetchingGameModeDate: "Ошибка при получении данных режима игры!",
    sorryWeCouldntSaveResults: "Извините, мы не смогли сохранить результат.",
    resultIsBeingSaved: "Результат сохраняется...",

    // Languages
    "language.uzbek": "Узбекский",
    "language.english": "Английский",
    "language.russian": "Русский",
    "language.spanish": "Испанский",
    "language.french": "Французский",
    "language.german": "Немецкий",
  },
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof Translations) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("uz")

  useEffect(() => {
    const savedLanguage = safeStorage.getItem("interface-language") as Language
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    safeStorage.setItem("interface-language", lang)
  }

  const t = (key: keyof Translations): string => {
    if (!key) return ""
    const translation = translations[language][key]
    return translation !== undefined ? translation : key
  }

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}



