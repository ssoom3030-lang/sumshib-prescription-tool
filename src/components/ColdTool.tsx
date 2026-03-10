import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  ClipboardList, 
  Info, 
  RotateCcw, 
  Stethoscope, 
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Pill,
  MessageSquare,
  Calendar,
  User
} from 'lucide-react';
import { COLD_STAGES, COLD_PRESCRIPTIONS } from '../constants';

const SYMPTOMS = [
  { id: 'fever', label: '발열', group: '전신' },
  { id: 'high_fever', label: '38.5도 이상 고열', group: '전신' },
  { id: 'sore_throat', label: '인후통', group: '전신' },
  { id: 'body_ache', label: '몸살', group: '전신' },
  { id: 'headache', label: '두통', group: '전신' },
  { id: 'runny_nose', label: '콧물', group: '호흡기' },
  { id: 'stuffy_nose', label: '코막힘', group: '호흡기' },
  { id: 'cough', label: '기침', group: '호흡기' },
  { id: 'phlegm', label: '가래', group: '호흡기' },
  { id: 'sinus_pain', label: '부비동 통증', group: '통증/합병증' },
  { id: 'ear_pain', label: '귀 통증', group: '통증/합병증' },
  { id: 'post_nasal_drip', label: '후비루', group: '통증/합병증' },
  { id: 'cough_2w', label: '2주 이상 기침', group: '만성/특수' },
  { id: 'dry_cough_all_day', label: '건조한 기침이 종일 지속', group: '만성/특수' },
  { id: 'cough_lying_down', label: '누우면 가래 섞인 기침', group: '만성/특수' },
  { id: 'morning_cough', label: '아침 기상 시 가래 기침', group: '만성/특수' },
  { id: 'dry_mucosa', label: '비점막 건조 의심', group: '의심증상' },
  { id: 'laryngitis', label: '후두염 의심', group: '의심증상' },
  { id: 'bronchitis', label: '기관지염 의심', group: '의심증상' },
  { id: 'pneumonia', label: '폐렴 의심', group: '의심증상' },
];

export default function ColdTool() {
  const [age, setAge] = useState<string>('');
  const [isRhinitisTreatment, setIsRhinitisTreatment] = useState(false);
  const [onsetTime, setOnsetTime] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [openPrescription, setOpenPrescription] = useState<string | null>(null);

  const ageGroup = useMemo(() => {
    if (!age) return '';
    const numAge = parseInt(age);
    return numAge < 10 ? '소아' : '청소년/성인';
  }, [age]);

  const classification = useMemo(() => {
    if (selectedSymptoms.length === 0) return null;

    // 1순위: 감기 후기
    const lateSymptoms = ['sinus_pain', 'ear_pain', 'post_nasal_drip', 'cough_2w'];
    if (selectedSymptoms.some(s => lateSymptoms.includes(s))) return 'late';

    // 2순위: 감기 중기
    const midSymptoms = ['runny_nose', 'stuffy_nose', 'cough', 'phlegm'];
    const midCount = selectedSymptoms.filter(s => midSymptoms.includes(s)).length;
    if (midCount >= 2) return 'mid';

    // 3순위: 감기 초기
    const earlySymptoms = ['fever', 'sore_throat', 'body_ache', 'headache'];
    const earlyCount = selectedSymptoms.filter(s => earlySymptoms.includes(s)).length;
    if (earlyCount >= 2) return 'early';

    // 보조 규칙 및 기본값
    if (selectedSymptoms.some(s => midSymptoms.includes(s))) return 'mid';
    if (selectedSymptoms.some(s => earlySymptoms.includes(s))) return 'early';

    return 'early'; // 기본값
  }, [selectedSymptoms]);

  const warnings = useMemo(() => {
    const list = [];
    if (selectedSymptoms.includes('high_fever')) {
      list.push('진통해열제 병행 가능');
      list.push('고열 지속 시 양방 전원 고려');
    }
    if (selectedSymptoms.includes('laryngitis')) list.push('후두염 의심으로 양방 평가 고려');
    if (selectedSymptoms.includes('bronchitis')) list.push('기관지염 의심으로 양방 평가 고려');
    if (selectedSymptoms.includes('pneumonia')) list.push('폐렴 의심으로 양방 평가 고려');
    if (selectedSymptoms.includes('dry_cough_all_day')) list.push('건조한 기침 지속 시 기관지염 및 폐렴 가능성 검토');
    if (selectedSymptoms.includes('cough_2w')) {
      list.push('기관지가 예민해진 상태일 수 있어 진해고 고려');
      list.push('감기 후기 또는 회복기 기침으로 분류');
    }
    if (selectedSymptoms.includes('post_nasal_drip') && selectedSymptoms.includes('dry_mucosa')) {
      list.push('후비루 기침 환자는 숨비음 또는 숨기운 고려');
    }
    if (selectedSymptoms.includes('sinus_pain')) {
      list.push('급성 부비동염에서 두통이나 관골부 통증이 심하면 항생제 치료 1~2주 고려');
    }
    if (selectedSymptoms.includes('ear_pain')) {
      list.push('급성 중이염에서 통증이나 고막 염증이 심하면 진통소염 및 항생제 치료 고려');
    }
    return list;
  }, [selectedSymptoms]);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const reset = () => {
    setAge('');
    setIsRhinitisTreatment(false);
    setOnsetTime('');
    setSelectedSymptoms([]);
    setOpenPrescription(null);
  };

  const resultData = classification ? COLD_STAGES[classification as keyof typeof COLD_STAGES] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 font-sans text-stone-900">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-6">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-4">
              <User className="text-blue-600" size={20} />
              <h2 className="text-lg font-bold">환자 기본 정보</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase">연령 (만)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="숫자 입력"
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {ageGroup && (
                    <span className={`shrink-0 px-2 py-1 rounded text-[10px] font-bold ${ageGroup === '소아' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                      {ageGroup}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase">증상 시작 시점</label>
                <input 
                  type="text" 
                  value={onsetTime}
                  onChange={(e) => setOnsetTime(e.target.value)}
                  placeholder="예: 2일 전"
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={isRhinitisTreatment}
                onChange={(e) => setIsRhinitisTreatment(e.target.checked)}
                className="w-5 h-5 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-blue-900 group-hover:text-blue-700 transition-colors">비염 치료 중 여부</span>
            </label>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={reset}
                className="w-full flex items-center justify-center gap-2 py-3 bg-stone-100 text-stone-600 rounded-xl font-bold hover:bg-stone-200 transition-all"
              >
                <RotateCcw size={18} /> 초기화
              </button>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-4 mb-6">
              <ClipboardList className="text-blue-600" size={20} />
              <h2 className="text-lg font-bold">증상 체크박스</h2>
            </div>

            <div className="space-y-6">
              {['전신', '호흡기', '통증/합병증', '만성/특수', '의심증상'].map(group => (
                <div key={group} className="space-y-3">
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">{group}</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {SYMPTOMS.filter(s => s.group === group).map(symptom => (
                      <label 
                        key={symptom.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          selectedSymptoms.includes(symptom.id)
                            ? 'bg-blue-50 border-blue-200 text-blue-900'
                            : 'bg-white border-stone-100 hover:border-stone-200 text-stone-600'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={selectedSymptoms.includes(symptom.id)}
                          onChange={() => toggleSymptom(symptom.id)}
                          className="w-4 h-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium">{symptom.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedSymptoms.length > 0 && resultData ? (
              <motion.div 
                key={classification}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
                  <div className="bg-blue-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="relative z-10 space-y-2">
                      <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">진단 단계</div>
                      <h3 className="text-4xl font-black">{resultData.name}</h3>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    {/* Warnings */}
                    {warnings.length > 0 && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl space-y-2">
                        <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                          <AlertTriangle size={18} /> 중요 알림 및 경고
                        </div>
                        <ul className="list-disc list-inside text-red-600 text-xs space-y-1">
                          {warnings.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <section className="space-y-3">
                          <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-blue-500" /> 주요 증상
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {resultData.symptoms.map((s, i) => (
                              <span key={i} className="px-3 py-1 bg-stone-100 rounded-full text-xs font-medium text-stone-600">{s}</span>
                            ))}
                          </div>
                        </section>

                        <section className="space-y-3">
                          <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                            <Stethoscope size={14} className="text-blue-500" /> 추천 진단 방법
                          </h4>
                          <ul className="space-y-1.5">
                            {resultData.diagnosis_methods.map((m, i) => (
                              <li key={i} className="text-sm text-stone-700 flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span> {m}
                              </li>
                            ))}
                          </ul>
                        </section>

                        <section className="space-y-3">
                          <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                            <Thermometer size={14} className="text-blue-500" /> 추천 치료 방법
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {resultData.treatments.map((t, i) => (
                              <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">{t}</span>
                            ))}
                          </div>
                        </section>
                      </div>

                      <div className="space-y-6">
                        <section className="space-y-3">
                          <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                            <Pill size={14} className="text-blue-500" /> 추천 처방
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {resultData.prescriptions.map((p, i) => (
                              <button 
                                key={i}
                                onClick={() => {
                                  setOpenPrescription(p);
                                  setTimeout(() => {
                                    document.getElementById('prescription-details')?.scrollIntoView({ behavior: 'smooth' });
                                  }, 100);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-1"
                              >
                                {p} <ArrowRight size={14} />
                              </button>
                            ))}
                          </div>
                        </section>

                        <section className="space-y-3">
                          <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare size={14} className="text-blue-500" /> 환자 티칭
                          </h4>
                          <ul className="space-y-2">
                            {resultData.teaching.map((t, i) => (
                              <li key={i} className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
                                {t}
                              </li>
                            ))}
                          </ul>
                        </section>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-stone-100">
                      <section className="space-y-3">
                        <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                          <AlertCircle size={14} className="text-orange-500" /> 주의사항
                        </h4>
                        <ul className="space-y-1.5">
                          {resultData.caution.map((c, i) => (
                            <li key={i} className="text-xs text-orange-700 font-medium flex items-start gap-2">
                              <span className="text-orange-400">•</span> {c}
                            </li>
                          ))}
                        </ul>
                      </section>

                      <section className="space-y-3">
                        <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                          <Info size={14} className="text-blue-500" /> 양방 협진/전원 필요 여부
                        </h4>
                        <ul className="space-y-1.5">
                          {resultData.western_referral.map((r, i) => (
                            <li key={i} className="text-xs text-blue-700 font-medium flex items-start gap-2">
                              <span className="text-blue-300">•</span> {r}
                            </li>
                          ))}
                        </ul>
                      </section>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-3xl border-2 border-dashed border-stone-200 text-stone-400 space-y-4">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center">
                  <Stethoscope size={40} />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-stone-600">증상을 선택해 주세요</p>
                  <p className="text-sm">왼쪽 패널에서 환자의 증상을 체크하면 결과가 자동으로 계산됩니다.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Panel: Prescription Details */}
      <section id="prescription-details" className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold">처방 상세 정보</h2>
          </div>
          <p className="text-xs text-stone-400 font-medium">처방명을 클릭하면 상세 내용을 확인할 수 있습니다.</p>
        </div>

        <div className="divide-y divide-stone-100">
          {Object.entries(COLD_PRESCRIPTIONS).map(([key, p]) => (
            <div key={key} className="group">
              <button 
                onClick={() => setOpenPrescription(openPrescription === key ? null : key)}
                className={`w-full px-8 py-5 flex items-center justify-between text-left transition-all ${
                  openPrescription === key ? 'bg-blue-50/50' : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg transition-all ${
                    openPrescription === key ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                  }`}>
                    {key}
                  </div>
                  <div>
                    <h3 className={`font-bold transition-colors ${openPrescription === key ? 'text-blue-700' : 'text-stone-700'}`}>{p.name}</h3>
                    <p className="text-xs text-stone-400">{p.purpose}</p>
                  </div>
                </div>
                {openPrescription === key ? <ChevronUp size={20} className="text-blue-600" /> : <ChevronDown size={20} className="text-stone-300" />}
              </button>
              
              <AnimatePresence>
                {openPrescription === key && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 pt-2 grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-6">
                        <section className="space-y-2">
                          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">처방 목적</h4>
                          <p className="text-sm font-bold text-blue-900">{p.purpose}</p>
                        </section>
                        <section className="space-y-2">
                          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">적응증</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {p.indications.map((ind, i) => (
                              <span key={i} className="px-2 py-0.5 bg-stone-100 rounded text-[11px] text-stone-600 font-medium">{ind}</span>
                            ))}
                          </div>
                        </section>
                        <section className="space-y-2">
                          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">효능</h4>
                          <p className="text-sm text-stone-700 leading-relaxed">{p.effect}</p>
                        </section>
                      </div>

                      <div className="space-y-6">
                        <section className="space-y-2">
                          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">추천 환자군</h4>
                          <p className="text-sm text-stone-700 leading-relaxed">{p.recommended_for}</p>
                        </section>
                        <section className="space-y-2">
                          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">군주 한약재 및 역할</h4>
                          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-2">
                            <div className="flex flex-wrap gap-1.5">
                              {p.herbs.main_herbs.map((h, i) => (
                                <span key={i} className="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-bold">{h}</span>
                              ))}
                            </div>
                            <p className="text-xs text-blue-700 font-medium">{p.herbs.role}</p>
                          </div>
                        </section>
                      </div>

                      <div className="space-y-6">
                        <section className="space-y-2">
                          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">복용법 및 기간</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                              <span className="text-[9px] font-bold text-stone-400 block mb-1">용법</span>
                              <span className="text-xs font-bold text-stone-700">{p.dosage.usage}</span>
                            </div>
                            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                              <span className="text-[9px] font-bold text-stone-400 block mb-1">최대 기간</span>
                              <span className="text-xs font-bold text-stone-700">{p.dosage.max_period}</span>
                            </div>
                          </div>
                        </section>
                        <section className="space-y-2">
                          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">기타 및 주의사항</h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-2">
                              <Calendar size={14} className="text-stone-400 mt-0.5" />
                              <div className="text-xs text-stone-600">
                                <span className="font-bold">대상:</span> {p.etc.age}
                                {'special_note' in p.etc && p.etc.special_note && (
                                  <p className="mt-1 text-stone-500 italic">{p.etc.special_note}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <AlertCircle size={14} className="text-orange-500 mt-0.5" />
                              <p className="text-xs text-orange-700 font-medium">{p.caution}</p>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-stone-400 text-xs py-8 border-t border-stone-100">
        <p>© 숨쉬는한의원. 본 툴은 내부 처방 가이드용으로 제작되었습니다.</p>
        <p>환자의 상태에 따라 최종 처방은 한의사의 진단 하에 변경될 수 있습니다.</p>
      </footer>
    </div>
  );
}
