import { $, state } from './state.js';

const pageInitialized = {
  dictionary: false,
  kanji: false,
  quiz: false,
  kotoba: false
};

const views = {
  loading: $('loading-view'),
  setup: $('setup-view'),
  study: $('study-view'),
  complete: $('complete-view'),
  dictionary: $('dictionary-view'),
  kanji: $('kanji-view'),
  quiz: $('quiz-view'),
  kotoba: $('kotoba-view'),
  settings: $('settings-view'),
};

export const router = {
  navigate(path) {
    window.location.hash = path;
  },

  handleRouteChange() {
    let hash = window.location.hash.replace('#', '') || '/';
    
    let viewName = 'setup';
    
    if (hash === '/' || hash === '/setup') viewName = 'setup';
    else if (hash === '/study') viewName = 'study';
    else if (hash === '/complete') viewName = 'complete';
    else if (hash === '/dictionary') viewName = 'dictionary';
    else if (hash === '/kanji') viewName = 'kanji';
    else if (hash === '/quiz') viewName = 'quiz';
    else if (hash === '/kotoba') viewName = 'kotoba';
    else if (hash === '/settings') viewName = 'settings';
    
    // Protection: if no session is active and trying to access study/complete, redirect to setup
    if ((viewName === 'study' || viewName === 'complete') && !state.sessionStartTime) {
      this.navigate('/');
      return;
    }

    this.showView(viewName);
  },

  async showView(name) {
    Object.values(views).forEach(v => {
      if (v) v.classList.remove('active');
    });

    if (views[name]) {
      views[name].classList.add('active');
    }

    if (name === 'dictionary' && !pageInitialized.dictionary) {
      const { initDictionary } = await import('./dictionary.js');
      initDictionary();
      pageInitialized.dictionary = true;
    }
    if (name === 'kanji' && !pageInitialized.kanji) {
      const { initKanjiPage } = await import('./kanji-page.js');
      initKanjiPage();
      pageInitialized.kanji = true;
    }
    if (name === 'quiz' && !pageInitialized.quiz) {
      const { initQuiz } = await import('./quiz.js');
      initQuiz();
      pageInitialized.quiz = true;
    }
    if (name === 'kotoba' && !pageInitialized.kotoba) {
      const { initKotobaList } = await import('./kotoba-list.js');
      initKotobaList();
      pageInitialized.kotoba = true;
    }
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRouteChange());
  }
};
