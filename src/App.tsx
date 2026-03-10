/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  User, 
  Baby, 
  Stethoscope, 
  ClipboardList, 
  Pill, 
  MessageSquare,
  Info,
  AlertCircle,
  ArrowRight,
  Lock,
  LogIn,
  Home,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { 
  PATIENT_TYPES, 
  KEYWORDS, 
  CLASSIFICATION_DATA, 
  QA_DATA, 
  HERBAL_STANDARDS,
  ClassificationType 
} from './constants';
import ColdTool from './components/ColdTool';
import logo from './assets/LOGO.png';

// Import Rhinitis Images
import img01 from './assets/01_GJBH.JPG';
import img02 from './assets/02_GJWC.JPG';
import img03 from './assets/03_NSBB.JPG';
import img04 from './assets/04_SS.JPG';
import img05 from './assets/05_AB.JPG';
import img07 from './assets/07_JGMG.JPG';
import img08 from './assets/08_PL.JPG';

type ViewState = 'login' | 'menu' | 'rhinitis' | 'cold';

export default function App() {
  const [view, setView] = useState<ViewState>('login');
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [loginError, setLoginError] = useState('');

  // Rhinitis Tool State
  const [patientType, setPatientType] = useState<'child' | 'adult'>('child');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [openQA, setOpenQA] = useState<number | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId === 'SSOOMH' && loginPw === 'SSOOMH2005') {
      setView('menu');
      setLoginError('');
    } else {
      setLoginError('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  const handleLogout = () => {
    setView('login');
    setLoginId('');
    setLoginPw('');
  };

  const classification = useMemo(() => {
    if (selectedKeywords.length === 0) return null;

    // Priority: 수술형 > 구조문제형 > 농성분비물형 > 건조위축형 > 건조비후형 > 부종형
    if (selectedKeywords.includes('K16')) return '수술형';
    if (selectedKeywords.some(k => ['K14', 'K15'].includes(k))) return '구조문제형';
    if (selectedKeywords.some(k => ['K11', 'K12', 'K13'].includes(k))) return '농성분비물형';
    if (selectedKeywords.some(k => ['K8', 'K9', 'K10'].includes(k))) return '건조위축형';
    if (selectedKeywords.some(k => ['K5', 'K6', 'K7'].includes(k))) return '건조비후형';
    if (selectedKeywords.some(k => ['K1', 'K2', 'K3', 'K4'].includes(k))) return '부종형';
    
    return null;
  }, [selectedKeywords]);

  const getClassificationImages = (type: string | null) => {
    switch (type) {
      case '부종형': return [img05];
      case '건조비후형': return [img01];
      case '건조위축형': return [img02];
      case '농성분비물형': return [img03];
      case '구조문제형': return [img07, img08];
      case '수술형': return [img04];
      default: return [];
    }
  };

  const toggleKeyword = (id: string) => {
    setSelectedKeywords(prev => 
      prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]
    );
    setShowResult(false);
  };

  const handleShowResult = () => {
    if (selectedKeywords.length > 0) {
      setShowResult(true);
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const resultData = classification ? CLASSIFICATION_DATA[classification] : null;

  const getFirstPrescription = (base: string) => {
    if (base === '숨비음') {
      return patientType === 'child' ? '숨비음' : '숨비음 A';
    }
    return base;
  };

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200 p-8 space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="w-48 h-16 mx-auto flex items-center justify-center">
              <img src={logo} alt="숨쉬는한의원 로고" className="max-w-full max-h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-blue-950">숨쉬는한의원 처방용</h1>
              <p className="text-stone-400 text-sm">의료진 전용 로그인</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase ml-1">ID</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  type="text" 
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="아이디를 입력하세요"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  type="password" 
                  value={loginPw}
                  onChange={(e) => setLoginPw(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            
            {loginError && (
              <p className="text-red-500 text-xs font-medium flex items-center gap-1 ml-1">
                <AlertCircle size={14} /> {loginError}
              </p>
            )}

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              로그인
            </button>
          </form>
        </motion.div>
        <p className="mt-8 text-stone-400 text-xs">© 숨쉬는한의원. All rights reserved.</p>
      </div>
    );
  }

  if (view === 'menu') {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl space-y-8"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-blue-950">처방 툴 선택</h2>
            <p className="text-stone-500">진료하실 과목을 선택해주세요.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => setView('rhinitis')}
              className="group bg-white p-8 rounded-3xl shadow-xl border border-stone-200 hover:border-blue-500 transition-all hover:shadow-2xl hover:-translate-y-1 flex flex-col items-center gap-6"
            >
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Stethoscope size={40} />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-stone-800">비염</h3>
                <p className="text-stone-400 text-sm mt-1">점막 키워드 기반 처방 툴</p>
              </div>
              <div className="w-full py-3 bg-stone-50 rounded-xl text-stone-600 font-bold group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                입장하기
              </div>
            </button>

            <button 
              onClick={() => setView('cold')}
              className="group bg-white p-8 rounded-3xl shadow-xl border border-stone-200 hover:border-blue-500 transition-all hover:shadow-2xl hover:-translate-y-1 flex flex-col items-center gap-6"
            >
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ClipboardList size={40} />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-stone-800">감기</h3>
                <p className="text-stone-400 text-sm mt-1">증상 기반 감기 분류 및 처방 툴</p>
              </div>
              <div className="w-full py-3 bg-stone-50 rounded-xl text-stone-600 font-bold group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                입장하기
              </div>
            </button>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={handleLogout}
              className="text-stone-400 hover:text-red-500 font-medium flex items-center gap-2 transition-colors"
            >
              <LogOut size={18} />
              로그아웃
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (view === 'cold') {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-20">
        <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setView('menu')}
                className="p-2 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-blue-600 transition-all"
                title="메뉴로 돌아가기"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="h-8 flex items-center">
                <img src={logo} alt="숨쉬는한의원 로고" className="h-full object-contain" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-blue-950">
                <span className="text-blue-600 ml-2">감기 처방 툴</span>
              </h1>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-lg text-stone-400 hover:text-red-500 transition-all"
              title="로그아웃"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>
        <ColdTool />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setView('menu')}
              className="p-2 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-blue-600 transition-all"
              title="메뉴로 돌아가기"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="h-8 flex items-center">
              <img src={logo} alt="숨쉬는한의원 로고" className="h-full object-contain" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-blue-950">
              <span className="text-blue-600 ml-2">한의사 처방용</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-xs font-medium text-stone-500 bg-stone-100 px-2 py-1 rounded">
              비염 점막 키워드 기반
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-lg text-stone-400 hover:text-red-500 transition-all"
              title="로그아웃"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Step 1: Patient Type */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</div>
            <h2 className="text-lg font-semibold">환자 유형 선택</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {PATIENT_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setPatientType(type.id as 'child' | 'adult')}
                className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  patientType === type.id 
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-inner' 
                    : 'border-stone-100 bg-stone-50 text-stone-500 hover:border-stone-200'
                }`}
              >
                {type.id === 'child' ? <Baby size={24} /> : <User size={24} />}
                <span className="font-bold text-lg">{type.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2: Keyword Selection */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</div>
            <h2 className="text-lg font-semibold">점막 키워드 선택 <span className="text-stone-400 text-sm font-normal ml-2">(복수 선택 가능)</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {KEYWORDS.map(keyword => (
              <label
                key={keyword.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedKeywords.includes(keyword.id)
                    ? 'border-blue-200 bg-blue-50/50'
                    : 'border-stone-100 hover:bg-stone-50'
                }`}
              >
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    checked={selectedKeywords.includes(keyword.id)}
                    onChange={() => toggleKeyword(keyword.id)}
                    className="w-4 h-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-blue-700 mb-0.5">{keyword.id}</span>
                  <span className="text-sm leading-tight text-stone-700">{keyword.label}</span>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleShowResult}
              disabled={selectedKeywords.length === 0}
              className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all ${
                selectedKeywords.length > 0
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              점막분류 결과 보기
              <ArrowRight size={20} />
            </button>
          </div>
          {selectedKeywords.length === 0 && (
            <p className="text-center text-stone-400 text-sm mt-3 flex items-center justify-center gap-1">
              <AlertCircle size={14} /> 키워드를 1개 이상 선택해주세요.
            </p>
          )}
        </section>

        {/* Step 3: Result Section */}
        <AnimatePresence>
          {showResult && resultData && (
            <motion.section
              id="result-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="bg-blue-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800/50 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-6">
                    <div>
                      <div className="text-blue-300 text-sm font-bold uppercase tracking-widest mb-1">A. 점막분류</div>
                      <h3 className="text-4xl font-black">{resultData.title}</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                          <ClipboardList size={14} /> B. 특징
                        </div>
                        <ul className="space-y-1">
                          {resultData.characteristics.map((item: string, i: number) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                          <div className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Info size={14} /> C. 진단명
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {resultData.diagnosis.map((item: string, i: number) => (
                              <span key={i} className="text-xs bg-blue-800/50 px-2 py-1 rounded border border-blue-700/50">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                          <div className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Stethoscope size={14} /> C. 진단 방법
                          </div>
                          <ul className="space-y-1">
                            {resultData.diagnosisMethod.map((item: string, i: number) => (
                              <li key={i} className="text-xs flex items-start gap-2">
                                <span className="text-blue-400">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-72 shrink-0 space-y-4">
                    {getClassificationImages(classification).map((url, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden border border-white/20 shadow-2xl">
                        <img 
                          src={url} 
                          alt={`${resultData.title} ${idx + 1}`}
                          className="w-full aspect-[4/3] object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                    <div className="bg-white/5 p-2 text-[10px] text-center text-blue-300 italic">
                      * 점막 참고 이미지 (시각적 이해를 돕기 위함)
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 flex flex-col">
                  <div className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-1">
                    <Pill size={16} /> D. 치료 및 처방
                  </div>
                  
                  <div className="space-y-6 flex-1">
                    <div>
                      <h4 className="text-sm font-bold text-stone-500 mb-2">치료 방법</h4>
                      <div className="flex flex-wrap gap-2">
                        {resultData.treatment.map((item: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 bg-stone-50 border border-stone-100 px-3 py-2 rounded-lg text-sm font-medium">
                            <CheckCircle2 size={14} className="text-blue-500" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-stone-500">처방 정보</h4>
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
                        <div>
                          <span className="text-[10px] font-black text-blue-600 uppercase block mb-1">1차 처방</span>
                          <p className="text-blue-950 font-bold">{getFirstPrescription(resultData.prescription.first)}</p>
                        </div>
                        <div className="h-px bg-blue-200/50"></div>
                        <div>
                          <span className="text-[10px] font-black text-blue-600 uppercase block mb-1">2차 처방</span>
                          <p className="text-blue-950 font-bold">{resultData.prescription.second}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
                  <div className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-1">
                    <MessageSquare size={16} /> E. 예후 및 티칭
                  </div>
                  <div className="space-y-4">
                    {resultData.prognosis.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Herbal Medicine Standards */}
              <div className="bg-stone-100 rounded-2xl p-6 border border-stone-200">
                <h4 className="text-sm font-bold text-stone-600 mb-4 flex items-center gap-2">
                  <ClipboardList size={16} /> 건강보험 첩약 처방 기준
                </h4>
                <div className="space-y-4">
                  {HERBAL_STANDARDS.map((herb, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
                      <h5 className="font-bold text-blue-800 mb-2">{herb.name}</h5>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-stone-400 uppercase">성인 기준</span>
                          <p className="text-xs text-stone-600 leading-relaxed">{herb.adult}</p>
                        </div>
                        <div className="h-px bg-stone-100"></div>
                        <div>
                          <span className="text-[10px] font-bold text-stone-400 uppercase">10세 이하 기준</span>
                          <p className="text-xs text-stone-600 leading-relaxed">{herb.child}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Q/A Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-6 border-b border-stone-100 bg-stone-50/50">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <MessageSquare size={20} className="text-blue-600" />
              자주 묻는 질문 (Q&A)
            </h2>
            <p className="text-sm text-stone-500 mt-1">숨쉬는한의원 치료에 대한 상세 안내입니다.</p>
          </div>
          
          <div className="divide-y divide-stone-100">
            {QA_DATA.map((item, index) => (
              <div key={index} className="group">
                <button
                  onClick={() => setOpenQA(openQA === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-stone-50 transition-colors"
                >
                  <span className={`text-sm font-bold transition-colors ${openQA === index ? 'text-blue-700' : 'text-stone-700'}`}>
                    {item.q}
                  </span>
                  {openQA === index ? (
                    <ChevronUp size={18} className="text-blue-600" />
                  ) : (
                    <ChevronDown size={18} className="text-stone-400" />
                  )}
                </button>
                <AnimatePresence>
                  {openQA === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <div className="bg-stone-50 rounded-xl p-4 text-sm text-stone-600 leading-relaxed whitespace-pre-wrap border border-stone-100">
                          {item.a}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 text-center text-stone-400 text-xs space-y-2">
        <p>© 숨쉬는한의원. 본 툴은 내부 처방 가이드용으로 제작되었습니다.</p>
        <p>환자의 상태에 따라 최종 처방은 한의사의 진단 하에 변경될 수 있습니다.</p>
      </footer>
    </div>
  );
}
