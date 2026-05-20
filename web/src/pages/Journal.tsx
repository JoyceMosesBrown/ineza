import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Brain, Activity, CheckCircle, ChevronRight, Volume2, Pause } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';

function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = (text: string, lang: string) => {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);

    const loadAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const isEn = lang === 'en';
      // Prefer a female voice for the target language
      const femaleNames = ['samantha', 'victoria', 'karen', 'zira', 'hazel', 'google uk english female', 'google us english female', 'aria', 'jenny', 'moira', 'tessa', 'fiona'];
      const langPrefix = isEn ? 'en' : 'fr';
      const female = voices.find(v => v.lang.startsWith(langPrefix) && femaleNames.some(n => v.name.toLowerCase().includes(n)))
        || voices.find(v => v.lang.startsWith(langPrefix) && v.name.toLowerCase().includes('female'))
        || voices.find(v => v.lang.startsWith(langPrefix) && v.localService)
        || voices.find(v => v.lang.startsWith(langPrefix))
        || voices[0];
      if (female) utt.voice = female;
      utt.lang = isEn ? 'en-US' : 'fr-FR';
      utt.rate = 0.86;
      utt.pitch = 1.05;
      utt.onstart = () => setSpeaking(true);
      utt.onend = () => setSpeaking(false);
      utt.onerror = () => setSpeaking(false);
      uttRef.current = utt;
      window.speechSynthesis.speak(utt);
    };

    // Voices may not be loaded yet on first call
    if (window.speechSynthesis.getVoices().length) {
      loadAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => { loadAndSpeak(); window.speechSynthesis.onvoiceschanged = null; };
    }
  };

  const stop = () => { window.speechSynthesis.cancel(); setSpeaking(false); };
  useEffect(() => () => { window.speechSynthesis.cancel(); }, []);

  return { speak, stop, speaking };
}

declare global {
  interface Window { SpeechRecognition: any; webkitSpeechRecognition: any; }
}

type Phase = 'write' | 'feelings' | 'response';
type Lang = 'rw' | 'en';

interface Feeling { key: string; category: 'emotion' | 'physical' | 'positive'; rw: string; en: string; bg: string; border: string; }
interface StepItem { icon: string; title: Record<Lang, string>; detail: Record<Lang, string>; }
interface FeelingData { headerType: 'ppd' | 'physical' | 'positive'; infoRw: string; infoEn: string; reassure?: boolean; steps: StepItem[]; }

const FEELINGS: Feeling[] = [
  // Emotional
  { key: 'anxious',     category: 'emotion',   rw: 'Mubitishwa',                    en: 'Anxious',                    bg: '#FFF3E0', border: '#F4A261' },
  { key: 'sad',         category: 'emotion',   rw: 'Agahinda',                      en: 'Sad',                        bg: '#FFF3E0', border: '#F4A261' },
  { key: 'tired',       category: 'emotion',   rw: 'Nanirwa',                       en: 'Exhausted',                  bg: '#FFF3E0', border: '#F4A261' },
  { key: 'overwhelmed', category: 'emotion',   rw: 'Birambura',                     en: 'Overwhelmed',                bg: '#FFEBEE', border: '#E53935' },
  { key: 'angry',       category: 'emotion',   rw: 'Uburakari',                     en: 'Angry / Irritable',          bg: '#FFEBEE', border: '#E53935' },
  { key: 'lonely',      category: 'emotion',   rw: 'Nkiyumva wenyine',              en: 'Lonely',                     bg: '#FFEBEE', border: '#E53935' },
  { key: 'scared',      category: 'emotion',   rw: 'Ntinya',                        en: 'Scared',                     bg: '#FFEBEE', border: '#E53935' },
  { key: 'guilty',      category: 'emotion',   rw: 'Nishinja',                      en: 'Feeling guilty',             bg: '#FFEBEE', border: '#E53935' },
  { key: 'numb',        category: 'emotion',   rw: 'Nkumva nta cyo',               en: 'Feeling nothing / Numb',     bg: '#FFEBEE', border: '#E53935' },
  { key: 'crying',      category: 'emotion',   rw: 'Nsimbura amarira',              en: 'Crying a lot',               bg: '#FFF3E0', border: '#F4A261' },
  { key: 'disconnected',category: 'emotion',   rw: 'Nkabura isano na mwana wanjye', en: 'Disconnected from my baby',  bg: '#FFEBEE', border: '#E53935' },
  { key: 'struggling',  category: 'emotion',   rw: 'Bigoye cyane',                  en: 'Really struggling',          bg: '#FFEBEE', border: '#E53935' },
  // Physical
  { key: 'backpain',    category: 'physical',  rw: 'Umugongo ubabara',              en: 'Back is aching',             bg: '#EDE7F6', border: '#7C3AED' },
  { key: 'headache',    category: 'physical',  rw: 'Umutwe ubabara',               en: 'Headache',                   bg: '#EDE7F6', border: '#7C3AED' },
  { key: 'noappetite',  category: 'physical',  rw: 'Nta nzara',                    en: 'No appetite',                bg: '#EDE7F6', border: '#7C3AED' },
  { key: 'nausea',      category: 'physical',  rw: 'Iseseme',                      en: 'Nausea',                     bg: '#EDE7F6', border: '#7C3AED' },
  { key: 'bodytired',   category: 'physical',  rw: 'Umubiri unanirwa',             en: 'Body feels heavy and tired', bg: '#EDE7F6', border: '#7C3AED' },
  { key: 'breastpain',  category: 'physical',  rw: 'Amabere ababara',              en: 'Breast pain',                bg: '#EDE7F6', border: '#7C3AED' },
  { key: 'notsleeping', category: 'physical',  rw: 'Sinsinzira',                   en: 'Cannot sleep',               bg: '#EDE7F6', border: '#7C3AED' },
  { key: 'dizziness',   category: 'physical',  rw: 'Umutwe urasimba',              en: 'Feeling dizzy',              bg: '#EDE7F6', border: '#7C3AED' },
  // Positive
  { key: 'okay',        category: 'positive',  rw: 'Meza neza',                    en: 'Okay',                       bg: '#E8F5E9', border: '#52B788' },
  { key: 'good',        category: 'positive',  rw: 'Neza',                         en: 'Good',                       bg: '#E8F5E9', border: '#40916C' },
  { key: 'happy',       category: 'positive',  rw: 'Nishimye',                     en: 'Happy',                      bg: '#E8F5E9', border: '#40916C' },
  { key: 'grateful',    category: 'positive',  rw: 'Nshimira',                     en: 'Grateful',                   bg: '#E8F5E9', border: '#40916C' },
];

const RESPONSES: Record<string, FeelingData> = {
  anxious: {
    headerType: 'ppd', reassure: true,
    infoRw: 'Kwibaza nyuma yo kubyara bigira ingaruka kuri 15-20% y\'abagore (WHO). Horomo za estrogen na progesterone ziguye vuba cyane nyuma yo kubyara, zigira ingaruka ku bice bya ubwonko bigenzura gutinya. Si ikosa ryawe - ni impinduka z\'imibiri.',
    infoEn: 'Anxiety affects 15-20% of new mothers according to WHO. After birth, estrogen and progesterone drop sharply, directly affecting the brain regions that regulate fear. This is a physiological change, not a character flaw.',
    steps: [
      { icon: 'Heart', title: { rw: 'Uburyo bwa 5-4-3-2-1', en: '5-4-3-2-1 grounding' }, detail: { rw: 'Vuga ibintu 5 ubona, 4 wumva, 3 ushobora gukora, 2 uhumeka, 1 ukunda. Ibi biterwa n\'ubushakashatsi bikuzamura vuba mu gihe cya gushukashuka.', en: 'Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste. Research shows this activates your sensory cortex and interrupts the anxiety cycle.' } },
      { icon: 'Activity', title: { rw: 'Gukanda imitsi (PMR)', en: 'Progressive muscle release' }, detail: { rw: 'Shyira hamwe imitsi y\'intoki inshuro 5 hanyuma urekure. Subiramo ku bikorwa 3. Umubiri urekura kwibaza iyo imitsi irekuwe.', en: 'Clench your fists tightly for 5 seconds then release. Repeat at 3 body points. The body releases anxiety when muscles physically relax - this is WHO-recommended relaxation therapy.' } },
      { icon: 'PenLine', title: { rw: 'Andika ibyo utinya neza', en: 'Write the exact worry' }, detail: { rw: 'Andika neza icyo utinya - si "byose", ahubwo "Ntinya ko..." Kubona gutinya ku mpapuro bikugabanya imbaraga zarwo vuba.', en: 'Write exactly what you fear in one sentence - not "everything", but "I am afraid that...". Naming a specific worry on paper reduces its perceived size and gives your CHW useful information.' } },
      { icon: 'Wind', title: { rw: 'Humeka 4-7-8', en: '4-7-8 breathing' }, detail: { rw: 'Humeka amagana 4, hahiriza amagana 7, sohora mu minwa amagana 8. Inshuro 4 gusa. Ibi bifasha umubiri gutuza vuba gusumba ubundi buryo.', en: 'Breathe in for 4, hold for 7, breathe out slowly for 8. Just 4 cycles. This breathing pattern activates the vagus nerve and calms the nervous system faster than other techniques.' } },
    ],
  },
  sad: {
    headerType: 'ppd', reassure: true,
    infoRw: 'WHO igena ko agahinda (PPD) ni indwara bishobora kuvurwa, si ubugoyagoya. Ubuvuzi wa mbere butandukana na imiti ni "behavioral activation" - gukora ibikorwa bito bifasha ubwonko gusubira mu buzima busanzwe.',
    infoEn: 'WHO classifies postpartum depression as a treatable medical condition, not weakness. First-line non-medication treatment is behavioral activation - doing small activities even without motivation, because action restores mood more reliably than waiting to feel better.',
    steps: [
      { icon: 'Activity', title: { rw: 'Igikorwa cyo gukanguka', en: 'One activation activity' }, detail: { rw: 'Hitamo ibikorwa kimwe gito ugukoresha umubiri - kutemba iminota 10, kwirinda ku izuba, cyangwa gutwara mwana hanze. Ubwonko bugabanuka ibimenyetso bya PPD hamwe n\'ibikorwa bito, ndetse n\'udashaka.', en: 'Choose one small physical activity - 10 minutes of walking, sitting in sunlight, or carrying baby outside. WHO evidence shows behavioral activation reduces PPD symptoms even when you do not feel motivated. Action changes mood.' } },
      { icon: 'Moon', title: { rw: 'Kugenzura iminsi ya solo', en: 'Track your pattern' }, detail: { rw: 'Shyira akamanyetso uyu munsi. Bwira umujyanama wawe igihe ubaho nabi cyane mu munsi. Ibi bifasha gutekereza imiti cyangwa ubuvuzi budakoresha imiti wakeneye.', en: 'Mark today on a calendar. Tell your CHW what time of day feels hardest. This information guides whether you need interpersonal therapy, light therapy, or other WHO-recommended treatments.' } },
      { icon: 'Leaf', title: { rw: 'Urumuri rw\'izuba iminota 20', en: '20 minutes of sunlight' }, detail: { rw: 'Jya hanze iminota 20 mu mafuruguto ya gatandatu na saa sita. Urumuri rw\'izuba rwongerera serotonin mu bwonko, bifasha PPD. Ubushakashatsi bwerekana ko ibi bifasha nka imiti muri bamwe.', en: 'Get outside for 20 minutes between 8am and 12pm. Sunlight exposure increases serotonin naturally. Research shows this can be as effective as medication for mild to moderate PPD when done consistently.' } },
      { icon: 'Phone', title: { rw: 'Saba ubuvuzi bwo kuganira', en: 'Ask for talking therapy' }, detail: { rw: 'Bwira umujyanama wawe ko ushaka "kuganira n\'umuganga w\'ubwonko." WHO igena Interpersonal Therapy (IPT) nk\'ubuvuzi bwa mbere bwa PPD. Ubuvuzi bwo kuganira bumaze gufasha benshi muri mu Rwanda.', en: 'Tell your CHW you would like talking therapy. WHO recommends Interpersonal Therapy (IPT) as first-line PPD treatment. It focuses on relationships and transitions, which is directly relevant to new motherhood.' } },
    ],
  },
  tired: {
    headerType: 'ppd', reassure: true,
    infoRw: 'Kubuza amasaha 6 ni ngombwa gutera PPD mu bagore banawe nyuma yo kubyara. Gutera ingufu si ubuvanye busa - ni imiterere ya kliniki ishingira ku kubura isinziro n\'ubunaniro bw\'umubiri.',
    infoEn: 'Losing 6 or more hours of sleep is a clinical trigger for PPD onset in postpartum women. Exhaustion is not laziness - it is a physiological state resulting from sleep deprivation and the physical demands of birth and breastfeeding combined.',
    steps: [
      { icon: 'Moon', title: { rw: 'Gusyama iminota 20 gusa', en: 'Power nap: 20 minutes exactly' }, detail: { rw: 'Gusyama iminota 20 gusa bifasha cyane. Ibirenze iminota 30 bitera ubunaniro bwiyongera bitewe na "inertia ya isinziro." Shyira alaramu kugira ngo ugenze neza.', en: 'A 20-minute nap restores alertness significantly. Naps longer than 30 minutes cause deeper grogginess due to sleep inertia. Set a timer and protect this time.' } },
      { icon: 'Utensils', title: { rw: 'Proteine mu masaha ya mbere yo gutura', en: 'Protein within one hour of waking' }, detail: { rw: 'Rya ikintu gikungahaye kuri proteine mu isaha imwe yo gutura - amagi, ibishyimbo, cyangwa inyama gato. Ibi bigumya glicogene mu maraso mu mwanya wose w\'uyu munsi, bikagabanya ubunaniro.', en: 'Eat something with protein within one hour of waking - eggs, beans, or a small piece of meat. This stabilizes blood sugar throughout the day and significantly reduces fatigue compared to skipping breakfast.' } },
      { icon: 'Users', title: { rw: 'Tondeka umuntu wo gutwara kwonsa kumwe', en: 'Arrange one shared night feed' }, detail: { rw: 'Saba umuntu wo mu rugo gutwara kwonsa kumwe bukeye. Isinziro cya gakondo k\'amasaha 4 gifasha ubwonko bwawe kunozwa kuruta isinziro rito rwa kenshi. Isinziro ryawe ni ngombwa nka ubuvuzi.', en: 'Ask a family member to take one night feed so you can sleep 4 uninterrupted hours. Research shows a single 4-hour sleep block does more for cognitive and emotional recovery than fragmented sleep of equal total length.' } },
      { icon: 'Phone', title: { rw: 'Saba isuzuma ry\'amaraso (anemia)', en: 'Ask for anemia check' }, detail: { rw: 'Ubunaniro bukabije nyuma yo kubyara kenshi buterwa na anemia y\'icyuma. Bwira umujyanama wawe akore isuzuma ry\'amaraso. Imiti y\'icyuma ishobora guhindura byinshi mu ndwi 2.', en: 'Severe persistent fatigue after birth is often iron deficiency anemia. Ask your CHW for a blood check. Iron treatment can make a dramatic difference within 2 weeks and is WHO-recommended for all postpartum women.' } },
    ],
  },
  overwhelmed: {
    headerType: 'ppd', reassure: true,
    infoRw: 'Ubwonko bugeze ku birenze imbaraga zawo, bukagaragaza ibimenyetso bya PPD. WHO igena "ubuvuzi bwo gukemura ibibazo" (Problem Solving Therapy) nk\'ubuvuzi bwa mbere bwa PPD - ugira ubushobozi bushobora kuvurwa, si ubugoyagoya.',
    infoEn: 'When the brain is overloaded, it shows PPD symptoms as a stress response. WHO recommends Problem Solving Therapy as first-line PPD treatment - your brain\'s capacity to cope is a medical issue that can be treated, not a character deficiency.',
    steps: [
      { icon: 'PenLine', title: { rw: 'Itonde n\'ibintu 3 gusa', en: 'Write list, circle only 3' }, detail: { rw: 'Andika byose bikugoye. Hanyuma inzi ibintu 3 bya ngombwa gusa. Vuga ngo "ibindi bizategereza ejo." Ubwonko bugabanuka impungenge iyo bikujije ku ibintu bike.', en: 'Write everything that is overwhelming you. Then circle only 3 things that truly matter today. Say out loud "the rest waits until tomorrow." This is the first step of WHO Problem Solving Therapy.' } },
      { icon: 'Clock', title: { rw: 'Uburyo bwa iminota 15', en: '15-minute rule' }, detail: { rw: 'Hitamo ibikorwa 1 muri izo 3, ufanye iminota 15 gusa, hanyuma hagarika nta makemwa. Gukora gato biruta kugira ubwenge bwinshi. Intambwe nto zisanga intambwe nini zirangira.', en: 'Take the first task on your list, work on it for exactly 15 minutes, then stop without guilt. Small consistent actions beat large intentions. Progress - even tiny - reverses the overwhelm cycle.' } },
      { icon: 'Volume2', title: { rw: 'Gabanya ibikugoye', en: 'Reduce inputs' }, detail: { rw: 'Funga inyanduruko za makuru, WhatsApp na notifications iyo bishoboka. Ubwonko bugabanuka ibindi bimenyetso bya PPD iyo bibuze imyirondoro myinshi. Ibi si ubugenge - ni ubuvuzi.', en: 'Turn off news, WhatsApp notifications, and social media when possible. The overwhelmed brain needs fewer inputs, not more. Reducing stimulation is a genuine clinical strategy, not avoidance.' } },
      { icon: 'Handshake', title: { rw: 'Saba inkunga kimwe', en: 'Delegate one task specifically' }, detail: { rw: 'Bwira umuntu kimwe gusa: "Shobora kuntera amafunguro?" cyangwa "Shobora gufata mwana iminota 20?" Gusaba inkunga kimwe gusa ni boroheje kandi bigira ingaruka nini ku birimo kukugoye.', en: 'Ask one person for one specific thing: "Can you bring me food?" or "Can you hold baby for 20 minutes?" One concrete ask is easier to make and more useful than a general request for help.' } },
    ],
  },
  angry: {
    headerType: 'ppd', reassure: true,
    infoRw: 'Uburakari bwihuse n\'ukugutitira ni ibimenyetso bya PPD bitatangwaho akamaro cyane mu Rwanda, aho abagore bakunze gusabwa kuba imbonerahamwe. WHO igena ibi mu bimenyetso bya PPD bisanzwe. Si umuco mubi - ni ubumuga bw\'imibiri.',
    infoEn: 'Sudden irritability and anger are PPD symptoms that are underrecognized in many settings where mothers are expected to be calm. WHO formally includes these in the PPD diagnostic criteria. This is not a character problem - it is a medical symptom.',
    steps: [
      { icon: 'Brain', title: { rw: 'Ugenzure HALT mbere', en: 'Check HALT first' }, detail: { rw: 'Mbere yo gusubizanya, baza ubwawe: Hungry (Ndasonze)? Angry (Nirakaye)? Lonely (Nkiyumva wenyine)? Tired (Nnanirwa)? Impamvu ya mbere y\'uburakari bwihuse ni kimwe muri iki. Iyo uzi impamvu, ugira ingufu zo guhaguruka.', en: 'Before reacting, ask yourself: Hungry? Angry (at something specific)? Lonely? Tired? Most sudden anger has one of these roots. Identifying the real cause gives you power to address it rather than just suppress it.' } },
      { icon: 'Activity', title: { rw: 'Sohora imbaraga mu mubiri', en: 'Physical anger discharge' }, detail: { rw: 'Genda vuba vuba iminota 5, kunda intoki, cyangwa shyira amazi ashyushye cyangwa a barafu ku maboko. Uburakari ni ingufu za fiziki mu mubiri - gukoresha umubiri ni inzira nziza zo kuzisohora mudasaba undi muntu.', en: 'Walk briskly for 5 minutes, squeeze a pillow, or hold hands under cold or warm running water. Anger produces a physical energy state in the body. Physical discharge is more effective than suppression and prevents it from being directed at family.' } },
      { icon: 'PenLine', title: { rw: 'Ibitabo by\'ibikangura', en: 'Trigger journal' }, detail: { rw: 'Andika: "Nakangutse iyo..." Nyuma yo kugendako, usuzume ibyo waanditse. Guhuza ibikangura bifasha umujyanama wawe kumenya uburakari bugira aho buturuka, kandi bishobora kukuvurwa.', en: 'Write: "I got angry when..." After the moment passes, review what you wrote. Identifying trigger patterns helps your CHW assess whether this is PPD irritability, situational stress, or a relationship issue - each needs different support.' } },
      { icon: 'Phone', title: { rw: 'Saba ubuvuzi bwo gutahura iburakari', en: 'Ask about anger management support' }, detail: { rw: 'Bwira umujyanama wawe ko uburakari bwihuse ni ikibazo. Bashobora kukuvuza imiti ya PPD cyangwa kukugeza ku muvuzi. Uburakari bwa PPD bugabanuka cyane hamwe n\'ubuvuzi bw\'ikibazo nyacyo.', en: 'Tell your CHW that sudden anger is a problem. They can refer you for PPD medication assessment or counseling. Anger as a PPD symptom responds very well to treatment once the underlying condition is addressed.' } },
    ],
  },
  lonely: {
    headerType: 'ppd', reassure: true,
    infoRw: 'Kwiyumva wenyine ni ikibazo cy\'ubuzima rusange kigira ingaruka ku ndwara. WHO igena "Social Prescribing" - guhuza abarwayi n\'inyigisho n\'inkunga z\'abaturage - nk\'ubuvuzi bw\'ibanze bwa PPD n\'ubwigunge.',
    infoEn: 'Loneliness is a documented health risk that directly worsens PPD outcomes. WHO\'s Social Prescribing approach - connecting patients with community support - is evidence-based first-line care for postpartum isolation.',
    steps: [
      { icon: 'Users', title: { rw: 'Tangira mu kigo cy\'Inzira Yacu', en: 'Use Our Circle now' }, detail: { rw: 'Andika ubutumwa bumwe mu kigo cy\'Inzira Yacu muri iyi porogaramu. Abanyina bageze mu myaka nk\'iyo bayumva iyo ibyiyumvo. Guhuza no kumva ko wumvwa bifasha ubwonko bwawe gukira vuba kuruta kuguma wenyine.', en: 'Post one message in Our Circle in this app right now. Other mothers nearby feel the same way. Feeling heard and connected reduces PPD severity faster than isolation. Even one interaction changes brain chemistry.' } },
      { icon: 'Phone', title: { rw: 'Saba umujyanama wawe akuhuze na banyina bandi', en: 'Ask CHW about mother groups' }, detail: { rw: 'Bwira umujyanama wawe ukeneye guhuza na banyina bandi muri akarere kawe. Mu Rwanda, CHW ashobora kukugeza ku itsinda ry\'abanyina. Ubuvuzi bwo guhuza abantu (peer support) bufite igikorwa kimwe n\'imiti ya PPD muri ubushakashatsi.', en: 'Tell your CHW you want to meet other mothers in your area. In Rwanda, CHWs can connect you to peer support groups. Group peer support for PPD has equal effectiveness to medication in multiple studies, especially when led by trained community health workers.' } },
      { icon: 'Baby', title: { rw: 'Nyura mu kigo cy\'ubuzima bwa mwana wawe', en: 'Use baby\'s clinic visits' }, detail: { rw: 'Inama z\'umwana muri kigo cy\'ubuzima ni amahirwe yo guhuza n\'abanyina bandi. Vugana na mugenzi wawe uri hariya. Ubuzima bwa mwana buha inzira zo guhuza z\'ubwumvikane.', en: 'Your baby\'s scheduled clinic visits are natural social opportunities. Talk to another mother in the waiting area. Baby-related routines create legitimate, shame-free reasons to leave home and engage with other adults.' } },
      { icon: 'Heart', title: { rw: 'Isano nto iri hafi', en: 'Small nearby connection' }, detail: { rw: 'Ubutumwa bwa vuba cyangwa ijwi note buri ngombwa nk\'ikiganiro gikomeye. Bwira umuntu kimwe ubu: "Ndakutekereza." Ubushakashatsi bwerekana ko isano nto yafasha ubwonko bwawe nka isano nini.', en: 'A short voice note or a brief text counts as much as a long conversation for brain chemistry purposes. Send one person a message right now: "I am thinking of you." Research confirms small connections reduce loneliness as effectively as longer interactions.' } },
    ],
  },
  scared: {
    headerType: 'ppd', reassure: true,
    infoRw: 'Ibitekerezo byo gutinya bitera 57% y\'abagore bafite PPD (ubushakashatsi). Ibitekerezo bya "intrusive" - nka gutinya gukora nabi mwana wawe - ni ibimenyetso by\'indwara, si ibitekerezo bigaragaza ingengabitekerezo yawe. Niba ubibwira umujyanama wawe, ashobora kukugeza ku ubuvuzi bw\'ibanze bwa Cognitive Behavioral Therapy.',
    infoEn: 'Fearful and intrusive thoughts affect 57% of mothers with PPD. Thoughts like "what if I harm my baby" are PPD symptoms - they are distressing precisely because they go against what you want. They are not intentions or predictions. Cognitive Behavioral Therapy (CBT), which your CHW can refer you to, is the WHO first-line treatment.',
    steps: [
      { icon: 'Heart', title: { rw: 'Kumenya ibitekerezo by\'indwara', en: 'Label the thought as a symptom' }, detail: { rw: 'Iyo ibitekerezo bya gutinya bigushobokeye, bwira ubwenge bwawe: "Ubu ni ibimenyetso bya PPD, si ukuri." Kumenya ibitekerezo nk\'ibimenyetso by\'indwara bibiganisha vuba kuruta kubihanganira cyangwa kubirwanya.', en: 'When a fearful thought appears, say to yourself: "This is a PPD symptom, not a fact or intention." Labeling a thought as a symptom reduces its power immediately - this is a core CBT technique and is evidence-based for PPD intrusive thoughts.' } },
      { icon: 'Brain', title: { rw: 'Isesengura ry\'ukuri', en: 'Reality check' }, detail: { rw: 'Andika gutinya nk\'ibi: "Ntinya ko X bizabaho." Hanyuma andika ibintu 3 bizi ukuri ubu - nka "Mwana wanjye ari muremure, ndamukunda, ndashaka ubugiraneza bwe." Ubwonko bwawe bugabanuka impungenge iyo ubuguye ibitekerezo ku mpapuro.', en: 'Write the fear as: "I fear that X will happen." Then write 3 things you know to be true right now - like "My baby is safe, I love them, I want their wellbeing." Getting thoughts on paper separates the thought from reality.' } },
      { icon: 'Phone', title: { rw: 'Bwira umujyanama wawe ibitekerezo bya gutinya', en: 'Tell your CHW about the thoughts' }, detail: { rw: 'Bwira umujyanama wawe neza ibitekerezo bya gutinya ufite, ndetse n\'ibigoye gusoma. Ntabwo bagukeka nabi - bazakufasha kubona ubuvuzi bwa Cognitive Behavioral Therapy (CBT) abandi benshi babyifashemo.', en: 'Tell your CHW exactly what fearful thoughts you are having, even the difficult ones. They will not judge you - intrusive fearful thoughts are a medical symptom. Your CHW can refer you for CBT, which has very high success rates for this specific PPD symptom.' } },
      { icon: 'Leaf', title: { rw: 'Shyira umuntu w\'icyizere hafi', en: 'Stay close to a safe person' }, detail: { rw: 'Niba ubona gutinya gukubye ingufu, guma hafi ya umuntu uzi n\'ukugirira icyizere - umubyeyi, mugenzi, cyangwa CHW wawe. Kwiyumva muremure hamwe n\'undi muntu bifasha vuba.', en: 'When fear intensifies, stay physically near one person you trust - a parent, friend, or your CHW. Feeling safe alongside another person helps regulate the fear response faster than being alone with the thoughts.' } },
    ],
  },
  guilty: {
    headerType: 'ppd', reassure: true,
    infoRw: 'Kwishinja bituruka ku bitekerezo bya PPD bigoye bita "All-or-nothing thinking" - ubwonko bwawe bugufata nka mubi rwose cyangwa neza rwose, nta hagati. Ubuvuzi bwa Cognitive Behavioral Therapy (CBT) butuma ibitekerezo nk\'ibi bigabanuka cyane.',
    infoEn: 'Guilt is driven by a PPD cognitive distortion called all-or-nothing thinking - your brain presents you as either completely failing or completely fine, with no middle ground. CBT, which your CHW can refer you to, directly addresses this pattern with very high success rates.',
    steps: [
      { icon: 'PenLine', title: { rw: 'Ugenzure ibimenyetso by\'ukuri', en: 'Evidence test' }, detail: { rw: 'Andika ikirego kimwe kwishinja kugira: nka "Ndi nyina mubi." Hanyuma andika ibimenyetso 2 BIBYEMEZA na 2 BIBIRWANYA. Ubwonko bwawe butagira ibimenyetso byo kwishinja bwose niba ubibona ku mpapuro.', en: 'Write one guilt statement: "I am a bad mother." Then list 2 pieces of EVIDENCE FOR and 2 pieces AGAINST. When your brain cannot find solid evidence, the guilt loses its grip. This is the CBT thought record technique.' } },
      { icon: 'Heart', title: { rw: 'Bwira inshuti yawe', en: 'Say what you\'d say to a friend' }, detail: { rw: 'Tekereza ko inshuti yawe ifite ikibazo kimwe nawe. Ni iki wobwira? Bwira ubwawe ibyo. Twakunze kwicuza benshi kurusha uko twicuza inshuti zacu. Kumenya ibyo ni intambwe ya mbere yo kwishinja gake.', en: 'Imagine your closest friend had your exact situation. What would you say to her? Say that to yourself. We judge ourselves by stricter standards than we would judge people we love. Noticing this gap is the first step to self-compassion, which is evidence-based for PPD.' } },
      { icon: 'CheckCircle', title: { rw: 'Inyandiko y\'intsinzi nto', en: 'Micro-success record' }, detail: { rw: 'Buri munsi, andika ibikorwa 1-2 wakoze kuri mwana wawe, ndetse n\'ibito rwose - kwonsa, gufata, gukizuye. Ibi birimo gusomwa kuri CHW wawe mu gusuzuma iterambere ryawe.', en: 'Every day, write 1-2 things you did for your baby, however small - feeding, holding, soothing. This list becomes evidence against the guilt thought. Bring it to your CHW visits - it helps them track your recovery accurately.' } },
      { icon: 'Leaf', title: { rw: 'Amagambo 3 y\'ubuntu', en: 'Three self-compassion words' }, detail: { rw: 'Buri munsi, bwira ubwenge bwawe inshuro 3: "Ndakora neza. Iri ni igihe kigoye. Nkeneye inkunga." Ubushakashatsi bwa Dr. Kristin Neff werekana ko kwita kuri ubwawe bifasha ubwonko bwawe gukira vuba kuruta kwihanganira gusa.', en: 'Three times a day, say: "I am doing my best. This is a hard time. I deserve support." Research by Dr. Kristin Neff shows that self-compassion accelerates PPD recovery faster than self-criticism or simply pushing through.' } },
    ],
  },
  numb: {
    headerType: 'ppd', reassure: true,
    infoRw: 'Kutumva ibyiyumvo (anhedonia) ni ibimenyetso bya PPD bituruka mu bwonko. Ubwonko bwawe bugabanya ibyiyumvo kugira ngo ubufashe gutuza imbaraga. Ubuvuzi bwa "Behavioral Activation" - gukora ibikorwa bidafite amafaranga, udashaka - bwerekana ko bifasha cyane.',
    infoEn: 'Emotional numbness (anhedonia) is a brain-based PPD symptom. Your brain is reducing emotional output to conserve resources under stress. Behavioral Activation therapy - doing activities even without motivation - is WHO evidence-based and specifically effective for this symptom.',
    steps: [
      { icon: 'Activity', title: { rw: 'Igikorwa kimwe nta gushaka', en: 'One activity without needing to want it' }, detail: { rw: 'Hitamo ibikorwa kimwe gito urikoreye mu gihe cyabanje - indirimbo ukunda, ibiryo bikukunda, cyangwa gutwara mwana hanze. Fanya ubu, ndetse n\'udashaka. Ibikorwa biganisha ibyiyumvo mu PPD, si undi mugongo.', en: 'Choose one small activity you used to enjoy - a song you liked, a food you loved, or a short walk. Do it now, even without wanting to. In PPD, action restores feeling rather than the other way around - waiting to feel motivated first keeps you stuck.' } },
      { icon: 'Heart', title: { rw: 'Guhuza ingingo z\'umubiri', en: 'Sensory reconnection' }, detail: { rw: 'Koraho ikintu cyoroheje, wumve isura y\'iminsi yashize, cyangwa wumve umuziki w\'amahera. Ingingo z\'umubiri zihuza ubwonko mu bihe bihari zirengera impinduka z\'ibyiyumvo. Ibi ni "Sensory Grounding" bifasha anhedonia.', en: 'Hold something warm like a cup of tea, smell something familiar, or feel fabric textures. Sensory circuits in the brain bypass the emotional shutdown of PPD. This "sensory grounding" is used in clinical settings specifically for anhedonia.' } },
      { icon: 'Baby', title: { rw: 'Gusekura mwana wawe iminota 10', en: '10 minutes of skin-to-skin with baby' }, detail: { rw: 'Shyira mwana wawe ku gituza cy\'umubiri wawe iminota 10. Ibi birekura oxytocin mu banyina bombi. Oxytocin igarura ibyiyumvo bya isano kandi ifasha PPD. Ntabwo ugomba kumva ikintu mbere - okubagezaho biba imbere.', en: 'Hold your baby skin to skin for 10 minutes. This releases oxytocin in both of you. Oxytocin restores bonding feelings and directly counters the numbness of PPD. You do not need to feel it before doing it - the feeling follows the contact.' } },
      { icon: 'Phone', title: { rw: 'Bwira CHW wawe ibyerekeye anhedonia', en: 'Tell CHW about numbness specifically' }, detail: { rw: 'Bwira umujyanama wawe neza: "Sinyumva ibyiyumvo - nta neza, nta mubabaro." Ibi ni ibimenyetso bya PPD bishobora gusaba imiti. Imiti ya antidepressant isanwa muri iminsi 2-4 kandi iragira akamaro. Ntihakabibe gusubira inyuma.', en: 'Tell your CHW specifically: "I feel nothing - no happiness, no sadness." This numbness is a symptom that may benefit from medication. Antidepressants take effect in 2-4 weeks and have a strong evidence base for postpartum anhedonia. You do not need to wait for it to pass on its own.' } },
    ],
  },
  crying: {
    headerType: 'ppd', reassure: true,
    infoRw: 'Kwihanagura (Baby Blues) ni bwa kamere mu ndwi 2 za mbere - 80% y\'abagore babibona. Ariko niba birakomeje birengeje ibyumweru 2 cyangwa biri bikabije, ni ibimenyetso bya PPD bisaba isuzuma ry\'Edinburgh Postnatal Depression Scale (EPDS) na CHW wawe.',
    infoEn: 'Tearfulness in the first 2 weeks is postpartum blues - normal in 80% of mothers. But if crying is persistent beyond 2 weeks, or feels intense and uncontrollable, it is a PPD symptom. Your CHW uses the Edinburgh Postnatal Depression Scale (EPDS) to assess severity and determine what level of support you need.',
    steps: [
      { icon: 'Heart', title: { rw: 'Rekera amarara asohoke', en: 'Allow the tears completely' }, detail: { rw: 'Oya amarara. Amarara asohora cortisol na adrenalini, bikuzura amahoro nyuma. Gunyura amarara neza biruta kugeraneza. Ntagira isoni - ni igikorwa cy\'ubwonko cy\'ubuzima.', en: 'Do not suppress the tears. Crying releases cortisol and adrenaline from your body and often brings genuine relief. Suppressing tears increases the physiological stress load. There is no shame in this - it is a healthy brain function.' } },
      { icon: 'PenLine', title: { rw: 'Kwerekana ibimenyetso kuri CHW wawe', en: 'Track for Edinburgh assessment' }, detail: { rw: 'Andika: Uyu munsi narize inshuro ngahe? Ni igihe kingahe? Ni iki cyakabaye? Ibi bifasha CHW wawe gufata Edinburgh Postnatal Depression Scale (EPDS) neza. Isuzuma iry ni iminota 5, kandi ritunga ubuvuzi bwiza bwawe.', en: 'Note: How many times did I cry today? For how long? What triggered it? This information helps your CHW administer the Edinburgh Postnatal Depression Scale accurately. The EPDS takes 5 minutes and directly guides your treatment plan.' } },
      { icon: 'Droplets', title: { rw: 'Nywa amazi na electrolytes', en: 'Rehydrate after crying' }, detail: { rw: 'Kurira cyane bikurisha sodium na potassium hamwe n\'amazi. Nywa amazi n\'ikintu gikungahaye - nka inzoga y\'ikigori cyangwa banana. Kubura electrolytes bitera imitwe, ubunaniro n\'ibyiyumvo bibi nyuma yo kurira.', en: 'Prolonged crying depletes sodium and potassium alongside water. Drink fluids with electrolytes - such as a banana or a small glass of juice with water. Electrolyte imbalance worsens headache, fatigue, and low mood after a crying episode.' } },
      { icon: 'Brain', title: { rw: 'Menye itandukaniro rya Baby Blues na PPD', en: 'Know the difference: blues vs PPD' }, detail: { rw: 'Baby Blues: bitangira ku munsi wa 3-5, birangira mbere y\'ibyumweru 2. PPD: bikomeza birengeje ibyumweru 2 cyangwa bikabije. Niba utazi aho uri, bwira CHW wawe - ni bo bihuza isuzuma ryakwifashaho.', en: 'Baby Blues: starts days 3-5, resolves within 2 weeks. PPD: lasts beyond 2 weeks or feels severe. If you are unsure, tell your CHW - they will use a validated screening tool to determine which you have and what level of support is right for you.' } },
    ],
  },
  disconnected: {
    headerType: 'ppd', reassure: true,
    infoRw: 'Gunanirwa gusanga mwana wawe bigira ingaruka kuri 25% y\'abagore bafite PPD. WHO na UNICEF berekana ko isano ishobora gufata ibyumweru cg amezi ndetse n\'ubwa kamere - si agateganyo k\'umubyeyi mwiza. Hamwe n\'ubuvuzi, isano igaruka kenshi.',
    infoEn: 'Bonding difficulties occur in around 25% of PPD cases. WHO and UNICEF note that bonding can take weeks to months even in healthy mothers - it is not instant. With PPD support, the bonding relationship improves consistently. Your love for your baby does not require a feeling to be real.',
    steps: [
      { icon: 'Baby', title: { rw: 'Kangaroo Care: iminota 30-60', en: 'Kangaroo care: 30-60 minutes' }, detail: { rw: 'Shyira mwana wawe ku gituza cy\'umubiri wawe kure y\'impuzu iminota 30-60. WHO igena iki nk\'ubuvuzi bwo kwongerera isano. Ibi birekura oxytocin muri nyina akamara, bifasha PPD na bonding icyarimwe.', en: 'Hold your baby skin-to-skin on your chest for 30-60 minutes. WHO recommends Kangaroo Care specifically for bonding support. It releases oxytocin in the mother\'s brain, directly counteracting both PPD and bonding difficulties simultaneously.' } },
      { icon: 'Volume2', title: { rw: 'Vugana na mwana wawe mu gihe cyo kumwitaho', en: 'Narrate during care routines' }, detail: { rw: 'Mu gihe cyo guhindura impuzu, kwonsa, no kumana, vuga icyo ukora: "Ndaguhindurira, ndagukunda." Ntabwo ari ngombwa kumva ibyiyumvo. Ijwi ryawe rikuza ubwonko bwa mwana wawe kandi ritera oxytocin ndetse n\'udashaka kumva ikintu.', en: 'During nappy changes, feeds, and baths, narrate what you are doing: "I am washing your hands. I am holding you." You do not need to feel anything. Your voice builds your baby\'s brain and triggers oxytocin release in yours - the feeling follows the action.' } },
      { icon: 'Brain', title: { rw: 'Soma inyandiko yo gusanga mwana wawe', en: 'Read the bonding article in Learn' }, detail: { rw: 'Genda mu gice cya Kwiga ukasome inyandiko yerekeye isano na mwana wawe. Kusobanukirwa ko isano ishobora gufata igihe - kandi ko ibyo ari bya kamere - bigabanya kwishinja kandi bikufasha gukomeza.', en: 'Go to the Learn section and read the article on building connection with your baby. Understanding that bonding takes time and is medically normal - not a reflection of your love - reduces guilt and helps you persist through the difficult early period.' } },
      { icon: 'Phone', title: { rw: 'Saba umujyanama wawe ubuvuzi bw\'isano', en: 'Ask CHW about mother-infant therapy' }, detail: { rw: 'Bwira umujyanama wawe ko ufite ibibazo by\'isano na mwana wawe. Hari ubuvuzi bwihariye bwa "mother-infant interaction therapy" bufasha cyane. Ubuvuzi bwo guhuza mwana n\'umubyeyi burangirwa muri Rwanda na CHW barozwe.', en: 'Tell your CHW you are struggling with bonding. Specialized mother-infant interaction therapy exists and is highly effective. Trained CHWs in Rwanda can provide structured bonding sessions or refer you to a facility that does. You do not have to work through this alone.' } },
    ],
  },
  struggling: {
    headerType: 'ppd', reassure: true,
    infoRw: 'Kumva ko ntushobora gukomeza ni ibimenyetso bya PPD ikabije. WHO ifata ibi nk\'ibimenyetso bisaba ubuvuzi vuba. Ntabwo ari ubugoyagoya - ni ibimenyetso by\'indwara, kandi ubufasha buhari.',
    infoEn: 'Feeling unable to cope is a symptom of severe PPD. WHO classifies this as requiring prompt professional support. This is not weakness or failure - it is a medical emergency of the mind, and treatment is available and effective.',
    steps: [
      { icon: 'Phone', title: { rw: 'Hamagara CHW wawe NONE', en: 'Contact your CHW RIGHT NOW' }, detail: { rw: 'Uyu ni ubutumwa bw\'ibanze: Hamagara cyangwa tuma SMS umujyanama wawe NONE. Bwira ngo: "Bigoye cyane uyu munsi. Ndakeneye ubufasha." Nta yindi ntambwe iri gamba gusumba iyi imwe.', en: 'This is the most important step: Call or text your CHW RIGHT NOW. Say: "I am really struggling today. I need support." No other step matters more than this one. CHWs are trained for exactly this situation.' } },
      { icon: 'Heart', title: { rw: 'Umunsi umwe, iminota imwe', en: 'One minute at a time' }, detail: { rw: 'Ntitekereza ku isaha itaha. Tekereza iminota 5 gusa iri imbere. Humeka burambe inshuro 5. Nubirangiza, subiramo. Igihe ubona bigoye cyane, gukomeza bitewe no guhumeka gusa ni intsinzi.', en: 'Do not think about the next hour. Think only about the next 5 minutes. Take 5 slow breaths. When those are done, take 5 more. When things feel this hard, simply continuing to breathe is enough. One minute at a time is a legitimate survival strategy.' } },
      { icon: 'Leaf', title: { rw: 'Tondeka umuntu wo kuguma nawe', en: 'Arrange someone to be with you' }, detail: { rw: 'Bwira umuntu - umubyeyi, mugenzi, cyangwa umwangarume - ko akagomba kukugumana none. Nusaba ubufasha ni igikorwa cy\'ubutwari. Gukera wenyine ubona bigoye cyane birashobora gukurusha ibimenyetso.', en: 'Ask one person - a parent, sibling, or partner - to come be with you right now. Asking for company when you are struggling is an act of courage, not weakness. Being alone when symptoms are this severe makes them worse and slows recovery.' } },
      { icon: 'Brain', title: { rw: 'Ibuka: Ubu si uko bizagenda iteka ryose', en: 'Remember: this moment is not permanent' }, detail: { rw: 'PPD iteye ubwonko bwawe gutekereza ko ibi ni bwa iteka ryose. Si ukuri. Ubushakashatsi bwerekana ko abantu benshi bafite PPD, hamwe n\'ubuvuzi, bagera ku buzima bwiza burundu. Ibi bizarangira, nubikira inkunga.', en: 'PPD causes your brain to believe this state is permanent. It is not. Research consistently shows that with appropriate support, the vast majority of mothers with even severe PPD fully recover. This will end. Getting support is how you reach that end.' } },
    ],
  },

  // ── PHYSICAL ────────────────────────────────────────────────────
  backpain: {
    headerType: 'physical', reassure: false,
    infoRw: 'Kubabara umugongo bigira ingaruka kuri 50-70% by\'abagore nyuma yo kubyara (ubushakashatsi wa WHO). Horomo ya relaxin iracyaguye amezi 3-4 nyuma yo kubyara, iterana n\'imipaka itabikuyemo. Kwonsa no gufata umwana mu imyanya itandukanye bitera ibibazo. Ibyo bishobora kuvurwa na fisioterapi.',
    infoEn: 'Back pain affects 50-70% of women after birth. The relaxin hormone remains elevated for 3-4 months postpartum, keeping joints loose and vulnerable. Breastfeeding posture and carrying positions are the main aggravating factors. Physiotherapy techniques and position changes give reliable relief.',
    steps: [
      { icon: 'Activity', title: { rw: 'Imyitozo ya fisioterapi yo gusimbuza inyuma', en: 'Pelvic tilt exercise' }, detail: { rw: 'Ryama ku mugongo, agurura amavi gato hejuru, hanyuma sunika umugongo w\'ikigere ku mwanya inshuro 10, iminota 5 kuri buri ikiruhuko. Iyi myitozo ni ya mbere isanwa na fisioterapi nyuma yo kubyara, kandi irinda kubabara gukomeza.', en: 'Lie on your back, bend knees, then gently flatten your lower back to the floor and hold for 5 seconds. Repeat 10 times, twice daily. This pelvic tilt is the first exercise recommended by physiotherapists postpartum and reliably reduces lower back strain within days.' } },
      { icon: 'Moon', title: { rw: 'Imyanya yo kwonsa idakoresha umugongo', en: 'Back-friendly feeding position' }, detail: { rw: 'Gerageza kwonsa uryamye ku ruhande (Side-lying position) cyangwa Football hold. Iyi myanya igabanya umuvuduko ku mugongo umara amasaa yo kwonsa. Baza umujyanama wawe akwereke - impinduka imwe y\'imyanya ishobora guhindura byinshi.', en: 'Try side-lying breastfeeding or the football hold position. These positions remove the spinal load you endure during standard upright feeding for hours daily. Ask your CHW to show you - a single position change is one of the most impactful interventions for postpartum back pain.' } },
      { icon: 'Heart', title: { rw: 'Ubushyuhe n\'ubukonje mu gihe kibanza', en: 'Heat then cold protocol' }, detail: { rw: 'Shyira ubushyuhe (udukara dushyushye) ku mugongo iminota 15 kugira ngo ugashishe imitsi. Nyuma y\'iminota 30, shyira ubukonje iminota 10 kugira ngo ugabanya ububyimba. Gukoresha ubushyuhe mbere n\'ubukonje nyuma ni uburyo bwiza bwa kliniki bwo kuvura imitwe.', en: 'Apply heat (warm cloth) for 15 minutes to warm the muscles. After 30 minutes, apply cold for 10 minutes to reduce any swelling. Heat before, cold after is the clinical protocol for muscle pain management - more effective than either alone.' } },
      { icon: 'Phone', title: { rw: 'Saba isuzuma niba ubabara buremerwa cyangwa bumereye mu maguru', en: 'Seek care for nerve signs' }, detail: { rw: 'Niba kubabara kurimo gutanga ibyiyumvo byo gukigwa cyangwa kuvuguruzanya mu maguru, byangwa unanirwa inshuro nyinshi buri munsi, bwira umujyanama wawe vuba. Ibimenyetso bya nev birengeza fisioterapi bisaba isuzuma rya muganga.', en: 'If pain includes numbness, tingling, or shooting sensations down your legs, or if it is severe and constant, tell your CHW soon. These signs indicate possible nerve involvement that needs medical assessment beyond physiotherapy exercises.' } },
    ],
  },
  headache: {
    headerType: 'physical', reassure: false,
    infoRw: 'IBYIBURITSO: Imitwe ikabije nyuma yo kubyara hamwe n\'impinduka y\'amaso, ububyimba bw\'ibirenge, cyangwa umuvuduko w\'amaraso mwinshi ni ibimenyetso by\'eclampsia ya nyuma (postpartum pre-eclampsia). Ibi bisaba kwihutira kubona umujyanama wawe. Imitwe yoroheje ni bya kamere kandi ituruka ku mpinduka za horomo, kubura amazi, cyangwa kusinzira gake.',
    infoEn: 'IMPORTANT CLINICAL NOTE: Severe headache after birth combined with visual changes, swollen feet, or high blood pressure is a sign of postpartum pre-eclampsia requiring urgent care. Mild to moderate headache is common and caused by hormonal shifts, dehydration, or poor sleep.',
    steps: [
      { icon: 'Brain', title: { rw: 'Banza ugenzure ibimenyetso bikomeye', en: 'Check for warning signs first' }, detail: { rw: 'BANZA ubaze ubwawe: Ubona ibintu bimyeye cyangwa amashusho mabi? Ibirenge bikubye ububyimba vuba? Umutwe ukubye ingufu vuba? Niba yego ari kimwe muri ibi, hamagara CHW wawe NONE - ibi bishobora kuba eclampsia y\'nyuma bisaba vurugu.', en: 'FIRST ask yourself: Do you have visual disturbances or blurred vision? Sudden swelling in your feet? A very severe sudden headache? If YES to any of these, call your CHW IMMEDIATELY - these are signs of postpartum pre-eclampsia, which is a medical emergency.' } },
      { icon: 'Droplets', title: { rw: 'Kubura amazi ni impamvu ya mbere', en: 'Hydration is the primary treatment' }, detail: { rw: 'Nywa glasi imwe none none, hanyuma nywa glasi 8 mu mwanya wose w\'uyu munsi. Imitwe nyinshi y\'igihe cyo nyuma yo kubyara ituruka ku kubura amazi bitewe no kwonsa. Iminsi itatuye y\'amazi menshi igabanya imitwe nziza.', en: 'Drink one full glass right now, then aim for 8 glasses throughout the day. Most postpartum headaches are caused by dehydration from breastfeeding fluid loss. Consistent hydration over 2-3 days resolves most non-medical postpartum headaches.' } },
      { icon: 'Moon', title: { rw: 'Kuruhuka mu cyumba gito gifunze', en: 'Rest in darkness' }, detail: { rw: 'Ryama mu cyumba gito, gufunga amaso, iminota 20 niba bishoboka. Ubwonko bwawe buri nka "overloaded" - guteza imitwe niyo mpamvu imitwe ikubye ingufu ubona urumuri cg umwaka. Gucibwa urumuri kandi gutezura bigabanya kubabara vuba.', en: 'Lie down in a darkened room with eyes closed for 20 minutes if possible. The postpartum brain is in an overloaded state - sensory sensitivity is why light and noise worsen headaches. Removing light and sound inputs reduces pain faster than medication for many common headaches.' } },
      { icon: 'Activity', title: { rw: 'Andika umusaruro na igihe kuri CHW', en: 'Track pattern for CHW assessment' }, detail: { rw: 'Andika: imitwe yabaye inshuro ngahe uyu munsi? Ni igihe kingahe? Kuyitera kagufi cyangwa kose? Niba yabaye inshuro nyinshi mu ndwi imwe, CHW wawe agomba kugenzura umuvuduko w\'amaraso kandi bishobora gutera isuzuma rya anemia.', en: 'Note: How many headaches this week? How long do they last? One-sided or all over? If you have had multiple headaches in one week, your CHW should check your blood pressure and consider iron assessment - both low iron and high blood pressure cause postpartum headaches and need different treatments.' } },
    ],
  },
  noappetite: {
    headerType: 'physical', reassure: false,
    infoRw: 'WHO igena ko abagore bonyesha bakeneye amacumba 500 y\'ingufu yiyongera buri munsi. Kwonsa gukoresha amazi menshi na ingufu zifite agaciro. Kutafite inzara nyuma yo kubyara bishobora guterwa na PPD, amazi make, cyangwa anemia y\'icyuma bizwi mu Rwanda. Kurya gake ni inzira nziza ya kliniki.',
    infoEn: 'WHO guidelines state breastfeeding mothers need 500 extra calories daily. Breastfeeding is nutritionally intensive. Loss of appetite postpartum is often caused by PPD, dehydration, or iron deficiency anemia - all common in Rwanda and all treatable. Small frequent meals are the clinical approach.',
    steps: [
      { icon: 'Utensils', title: { rw: 'Ibiryo bikungahaye bifite agaciro gato', en: 'Nutrient-dense mini-meals' }, detail: { rw: 'Rya ibiryo bikungahaye gato buri masaha 2-3: igitoki n\'ikinyobwa, amagi, ibishyimbo, ubunyobwa. Ibiryo 6 bito mu mwanya wose w\'umunsi birusha ibiryo 3 bya kamere iyo udafite inzara kandi aribyo WHO isaba abanyina bonyesha.', en: 'Eat small nutrient-dense portions every 2-3 hours: banana with peanut butter, eggs, beans, yogurt, or any available protein. Six small meals throughout the day is WHO-recommended for breastfeeding mothers with low appetite and provides better nutrition than forcing 3 large meals.' } },
      { icon: 'Leaf', title: { rw: 'Ibiryo bikungahaye ibyuma (iron)', en: 'Iron-rich foods at every meal' }, detail: { rw: 'Shyira mu mirire ibiryo bikungahaye ibyuma buri kiryo gito: imboga z\'icyatsi, ibishyimbo, inyama y\'igitare. Fata hamwe na ivumba ry\'umuceri cyangwa ibimanyu kugira ngo ibyuma byinjire neza. Anemia y\'ibyuma ni impamvu ya mbere y\'kutafite inzara nyuma yo kubyara mu Rwanda.', en: 'Include iron-rich food at every small meal: dark leafy vegetables, beans, small amounts of meat. Eat with vitamin C food like tomato or orange to double iron absorption. Iron deficiency is the leading nutritional cause of appetite loss postpartum in Rwanda, and it also worsens fatigue and PPD.' } },
      { icon: 'Droplets', title: { rw: 'Amazi n\'inzoga z\'imvura mbere yo kurya', en: 'Fluids before meals' }, detail: { rw: 'Nywa glasi y\'amazi cyangwa inzoga y\'ikigori 20 min mbere yo kurya. Ibi biteranyije ibyifuzo by\'inzara kandi biganisha amara guturika kurya ibiryo bike. Amazi menshi kandi agabanya inyonko z\'amata bikuzuza ingufu.', en: 'Drink a glass of water or juice 20 minutes before eating. This primes hunger signals and helps your stomach accept small meals. Staying well-hydrated while breastfeeding also prevents the headaches and fatigue that suppress appetite further.' } },
      { icon: 'Phone', title: { rw: 'Saba suplement ya ibyuma na folic acid', en: 'Ask for iron and folic acid supplements' }, detail: { rw: 'Bwira umujyanama wawe ko udafite inzara kandi usaba suplement ya ibyuma n\'acide folique. WHO isaba suplement ya ibyuma na acide folique kwa nyina bonyesha amezi 6 nyuma yo kubyara, ariko benshi ntibabihabwa. Suplement izi zihindura cyane mu ndwi 2-3.', en: 'Tell your CHW you have no appetite and ask for iron and folic acid supplements. WHO recommends iron and folic acid supplementation for 6 months postpartum for all breastfeeding mothers, but many do not receive them. These supplements address the most common nutritional cause of appetite loss.' } },
    ],
  },
  nausea: {
    headerType: 'physical', reassure: false,
    infoRw: 'Iseseme nyuma yo kubyara ishobora guturuka ku mpinduka za horomo, imiti ya ibyuma ifatirwa ku nda nziza, cyangwa gutya inzara. Ubuvuzi bwa mbere ni ibiryo bito n\'ubukonje, kandi tangawira n\'ingano (ginger) bifite igikorwa cy\'ubushakashatsi bwerekana ko ifasha iseseme.',
    infoEn: 'Postpartum nausea can result from hormonal changes, iron supplements taken on an empty stomach, or skipping meals. First-line treatment is small bland foods and cool fluids. Ginger is evidence-based for nausea relief and safe during breastfeeding.',
    steps: [
      { icon: 'Utensils', title: { rw: 'Ibiryo bya BRAT mbere yo guhaguruka', en: 'BRAT foods before standing' }, detail: { rw: 'Mbere yo guhaguruka mu gitanda, rya kimwe: igitoki, n\'imyenda, avoka, cyangwa umwibo. BRAT (Banana, Rice, Applesauce, Toast) ni ibiryo bifite agaciro ku nda ikeneye ukuzira. Kuguma hamwe n\'ikintu gito mu nda bigabanya iseseme ya mu gitondo.', en: 'Before getting out of bed, eat one of: banana, plain rice, avocado, or dry bread. BRAT foods (Banana, Rice, Applesauce, Toast) are clinically recommended for nausea because they are easy on the stomach lining. Having something in your stomach before standing dramatically reduces morning nausea.' } },
      { icon: 'Leaf', title: { rw: 'Ingano (Ginger) ni ubuvuzi bwerekanywe n\'ubushakashatsi', en: 'Ginger: evidence-based nausea treatment' }, detail: { rw: 'Inywa icyayi cy\'ingano cyangwa ubwenya gato bw\'ingano nyakuri mu mirire. Ubushakashatsi bwinshi bwerekana ko ingano igabanya iseseme nka imiti ya domperidone muri bamwe, kandi ni salama mu bonyesha. Jya ku mubazzi wawe niba usanga ibyo bifasha.', en: 'Drink ginger tea or chew a small piece of fresh ginger. Multiple clinical trials show ginger reduces nausea as effectively as medication in many cases, and it is safe during breastfeeding. This is a WHO-recognized natural antiemetic supported by strong evidence.' } },
      { icon: 'Moon', title: { rw: 'Ruhuka ushyize umutwe hejuru gato', en: 'Rest at an incline' }, detail: { rw: 'Ryama cyangwa ufate umwanya uguritswe kure y\'iminota 30 nyuma yo kurya. Kucunduka burundu ku nda iri buzima byongerera iseseme kuko ingirabuzima z\'amata zishobora kwikubita. Gukoresha imitako yo kuguruka bifasha cyane.', en: 'Lie down or sit propped up for at least 30 minutes after eating. Lying completely flat when the stomach is full worsens nausea because stomach contents can shift. Using a pillow to stay slightly elevated after meals is a simple clinical recommendation.' } },
      { icon: 'Phone', title: { rw: 'Genzura imiti y\'ibyuma wibye', en: 'Check your iron supplement timing' }, detail: { rw: 'Niba ufata suplement y\'ibyuma (iron), zifata hamwe n\'ibiryo bya gato, si ku nda nziza. Suplement z\'ibyuma ni impamvu ya mbere y\'iseseme nyuma yo kubyara. Bwira CHW wawe - bashobora guhindura dosaje cyangwa guguha suplement y\'ubwoko butandukanye.', en: 'If you take iron supplements, always take them with food, never on an empty stomach. Iron supplements are the leading medication cause of postpartum nausea. Tell your CHW - they may change the timing, dose, or type of iron supplement, which often resolves the nausea immediately.' } },
    ],
  },
  bodytired: {
    headerType: 'physical', reassure: false,
    infoRw: 'Anemia y\'ibyuma igira ingaruka kuri 50% y\'abagore nyuma yo kubyara mu burengerazuba bwa Afrika (WHO). Iyi ni impamvu ya mbere y\'ubunaniro bukabije bw\'umubiri mu nyina bonyesha. Ubuzima bw\'amaraso n\'ibiryo bifite ibyuma bifasha cyane, ariko isuzuma ry\'amaraso rirakenewe niba ubunaniro bukomeje.',
    infoEn: 'Iron deficiency anemia affects 50% of postpartum women in sub-Saharan Africa according to WHO. It is the leading cause of severe physical fatigue in breastfeeding mothers. Nutrition and iron treatment help significantly, but a blood test is needed if fatigue persists for more than 2 weeks.',
    steps: [
      { icon: 'Utensils', title: { rw: 'Proteine n\'ibyuma vuba mu gitondo', en: 'Protein and iron early in the day' }, detail: { rw: 'Rya ibiryo bikungahaye kuri proteine na ibyuma mu masaha ya mbere: amagi, ibishyimbo, imboga z\'icyatsi. Ibiryo bya proteine bigumya glicogene mu maraso mu mwanya wose w\'umunsi, bigabanya ubunaniro bwo mu gitondo ndetse n\'ubunaniro bwa nyuma y\'umugoroba.', en: 'Eat protein and iron-rich food within one hour of waking: eggs, beans, dark leafy greens. Protein in the morning stabilizes blood sugar for the entire day, significantly reducing fatigue compared to a carbohydrate-only breakfast or skipping the meal entirely.' } },
      { icon: 'Activity', title: { rw: 'Genda hanze iminota 10 buri munsi', en: '10-minute walk outside daily' }, detail: { rw: 'Genda hanze iminota 10 buri munsi, ndetse no gutwara mwana wawe. Urumuri rw\'izuba rwongerera Vitamin D kandi rugabanya imibabaro y\'umubiri. Iminota 10 gusa buri munsi yagaragazwaho igikorwa cyinshi kuri fatigue na PPD muri ubushakashatsi bwa kliniki.', en: 'Walk outside for 10 minutes daily, even while carrying baby. Sunlight increases Vitamin D (deficient in many postpartum women) and gentle movement improves circulation and reduces the heavy fatigue feeling. Just 10 minutes daily has a measurable effect on both physical fatigue and PPD in clinical research.' } },
      { icon: 'Leaf', title: { rw: 'Gukoresha ingufu z\'ingenzi gusa', en: 'Energy conservation strategy' }, detail: { rw: 'Teganya ibikorwa 3 bya ngombwa gusa kuri buri munsi, uhindure ibindi byose. "Ngombwa" bivuze gukungahaza mwana wawe, kurya, no gusura. Ibindi byose - gukoza, kutozeza - biragomba gutegereza. Ibi ni uburyo bwa kliniki bwa "energy conservation" bukoresha mu bworozi.', en: 'Plan only 3 essential tasks per day and delegate or postpone everything else. "Essential" means feeding your baby, eating, and resting. Everything else - cleaning, tidying, cooking elaborately - waits. This energy conservation strategy is used in occupational therapy and prevents the exhaustion cycle from deepening.' } },
      { icon: 'Phone', title: { rw: 'Saba isuzuma ry\'amaraso (CBC + ferritin)', en: 'Request blood test: CBC and ferritin' }, detail: { rw: 'Bwira umujyanama wawe ukeneye isuzuma ry\'amaraso birimo "CBC na ferritin." Ibi bigaragaza anemia y\'ibyuma vuba. Niba isuzuma rigaragaza anemia, suplement y\'ibyuma ishobora kuhindura ubunaniro mu ndwi 2-4 gusa. Ibi si ibisanzwe byo gukira - ni ubuvuzi bw\'ibanze bushingiye ku kliniki.', en: 'Tell your CHW you need a blood test including CBC (complete blood count) and ferritin. This identifies iron deficiency anemia directly. If anemia is confirmed, iron supplementation can reverse severe fatigue within 2-4 weeks. This is not just waiting it out - it is targeted clinical treatment.' } },
    ],
  },
  breastpain: {
    headerType: 'physical', reassure: false,
    infoRw: 'WHO na UNICEF berekana ko ububabare bw\'amabere bukabije bwa mbere bugira icyitonderwa kimwe cyane: imyanya yo kwonsa (latch). Imbuto nziza y\'imbwa y\'amabere (latch correction) igabanya ububabare mu masaha 24-48. Ibimenyetso bya mastitis - umuteku, ubushyuhe bw\'umubiri, n\'amabere akubye ingufu - bisaba vurugu.',
    infoEn: 'WHO and UNICEF identify that the primary cause of severe breastfeeding pain is latch technique. Correct latch assessment and guidance reduces pain within 24-48 hours in most cases. Signs of mastitis - redness, fever, and hard breast area - require urgent CHW assessment today.',
    steps: [
      { icon: 'Baby', title: { rw: 'Isuzuma ry\'imyanya ya mbere (latch)', en: 'Latch assessment is the first step' }, detail: { rw: 'Ububabare bwa amabere 80% buturuka ku mbwa mibi y\'amabere. Imyanya nziza: akanwa ka mwana kafungura cyane, umunwa uri ku kirere cy\'amabere rwose, intama n\'ibibero biryose mu kanwa. Baza umujyanama wawe akwereke imyanya nziza - iyi ni intambwe ya mbere ya kliniki.', en: 'Around 80% of breastfeeding pain is caused by incorrect latch. Correct signs: baby\'s mouth opens wide, covers the entire areola not just nipple, lips flanged out, chin touching breast. Ask your CHW to assess your latch in person - this single correction resolves most pain within 24-48 hours.' } },
      { icon: 'Activity', title: { rw: 'Gukama amata neza mbere niba amabere aremerwa', en: 'Express if engorged before feeding' }, detail: { rw: 'Niba amabere aremerwa cyane mbere yo kwonsa, kama amata make gato ku ntoki kugira ngo amabere abuke. Imbwa y\'amabere aremerwa ni yo mbwa mibi kandi iterana n\'ububabare. Kama amata gake (gato) mbere bifasha mwana kubona imbwa nziza.', en: 'If breasts feel very hard before a feed, hand-express a small amount to soften the areola. An engorged breast makes latching correctly very difficult and directly causes pain. Softening the areola before feeding makes it possible for baby to latch deeply and immediately reduces nipple pain.' } },
      { icon: 'Heart', title: { rw: 'Gukoresha ubushyuhe mbere na ubukonje nyuma buri kwonsa', en: 'Warm before, cold after every feed' }, detail: { rw: 'Mbere yo kwonsa: shyira udukara dushyushye iminota 5 kugira ngo amata amaze gutera vuba. Nyuma yo kwonsa: shyira udukara gushyushye cyangwa amabere menshi y\'amata y\'ingagi akonje iminota 5-10 kugira ngo ugabanya ububyimba na ububabare. Iyi myitozo igabanya ububabare 40-60% niba ikoreshwa kenshi.', en: 'Before feeding: apply warm cloth for 5 minutes to trigger letdown faster. After feeding: apply cool cloth or chilled cabbage leaf for 5-10 minutes to reduce swelling and pain. This warm-then-cold protocol reduces breastfeeding pain by 40-60% when used consistently at every feed.' } },
      { icon: 'Phone', title: { rw: 'Ibimenyetso bya mastitis bisaba ubufasha vuba NONE', en: 'Mastitis warning signs need care TODAY' }, detail: { rw: 'Hamagara CHW wawe NONE niba ubona: amabere arimo umuteku, ubushyuhe cyangwa ibisobanuro by\'ibisebe, ubushyuhe bw\'umubiri (fever), cyangwa imuka ikomeye y\'amabere imwe. Mastitis isaba imiti ya antibiotique yo ku munsi umwe. Kwirinda gufata ibyo iminsi irengeje imwe itariyo kurya imiti.', en: 'Contact your CHW TODAY if you notice: breast redness or skin discoloration, warmth, a hard lump, or a fever above 38C. Mastitis is a breast infection requiring antibiotics within 24 hours. Waiting more than 1-2 days significantly increases the risk of abscess, which requires surgical drainage.' } },
    ],
  },
  notsleeping: {
    headerType: 'ppd', reassure: true,
    infoRw: 'Kutasinzira ndetse mwana araryamye ni ibimenyetso bya PPD bituruka ku kazi ka ubwonko, si ubugenge. WHO igena Cognitive Behavioral Therapy for Insomnia (CBT-I) nk\'ubuvuzi bwa mbere bwa insomnia yihariye - bwanze kuruta imiti ya isinziro kandi nta ngaruka mbi.',
    infoEn: 'Inability to sleep when the baby sleeps is a neurological PPD symptom - your brain is stuck in hypervigilance mode. WHO identifies Cognitive Behavioral Therapy for Insomnia (CBT-I) as first-line treatment for this type of insomnia - it outperforms sleeping medication and has no side effects.',
    steps: [
      { icon: 'Moon', title: { rw: 'Ritual ya kwihinduranya ya gusinzira', en: 'Consistent wind-down ritual' }, detail: { rw: 'Buri joro, mbere y\'iminota 30 yo gutuza, fanya ibintu bimwe bimwe: vana telefone, nywa icyayi cya chamomile, ryama mu cyumba gishyushye. Ubwonko bumenyereza ritual, bugatangira gukora isinziro mbere y\'aho uryama. Mu ndwi 1-2 ubona impinduka niba ritual igumye.', en: 'Every night, for 30 minutes before sleep, do the same sequence: put phone away, drink chamomile tea, lie in a cool room. The brain learns the pattern and begins triggering sleep onset before you even lie down. You will see a difference within 1-2 weeks of consistent practice.' } },
      { icon: 'PenLine', title: { rw: 'Sohora ibyo mu bwenge mbere yo kuryama', en: 'Brain dump before bed' }, detail: { rw: 'Mbere yo kuryama, andika byose biri mu bwenge bwawe ku mpapuro imwe. Hanyuma funga dossier. Ubwonko bwawe bukomeza kwibwira ibyabo kugira ngo wirinde kwibagirwa. Kuyandika bigabanya "loop" y\'ubwonko kandi bifasha isinziro gukwira.', en: 'Before lying down, write everything on your mind on a piece of paper - worries, to-dos, fears. Then close the notebook. Your brain repeats thoughts to avoid forgetting them. Writing them down releases the brain from this task and allows sleep onset. This is a core CBT-I technique.' } },
      { icon: 'Volume2', title: { rw: 'Ijwi ritandukanye (white noise)', en: 'White noise or consistent sound' }, detail: { rw: 'Shyira ijwi ritandukanye ry\'amashanyarazi - ibice by\'inyanja, imvura, cyangwa fan. Ibijwi bya vuba bya mwana n\'iz\'inzu bibyaza ubwonko bwawe muri "alert mode" vuba. Ijwi ritandukanye rikurinda kuzinduka karorero, ryongera amasaa y\'isinziro nyinshi.', en: 'Use a white noise machine, app, or fan. Sudden sounds - baby movements, household noises - snap the hypervigilant PPD brain awake. Consistent background sound masks sudden noises and increases total sleep time. This is a standard clinical recommendation for postpartum hypervigilance insomnia.' } },
      { icon: 'Phone', title: { rw: 'Saba CBT-I na isuzuma ry\'imiti', en: 'Ask about CBT-I and medication assessment' }, detail: { rw: 'Bwira umujyanama wawe neza: "Sinsinzira ndetse mwana araryamye." Bashobora kukugeza ku munyamuryango w\'ubuvuzi bwa CBT-I cyangwa isuzuma ry\'imiti. WHO igena CBT-I nk\'ubuvuzi bwumvikana kuruta imiti ya isinziro kandi buri ubuvuzi burambye. Ntabwo ugomba gukomeza ubwigunge.', en: 'Tell your CHW specifically: "I cannot sleep even when my baby sleeps." They can refer you for CBT-I therapy or medication assessment. WHO identifies CBT-I as more effective and longer-lasting than sleeping medication. This insomnia is treatable - you do not have to continue suffering.' } },
    ],
  },
  dizziness: {
    headerType: 'physical', reassure: false,
    infoRw: 'IBYIBURITSO: Igiturumbuka gikabije hamwe n\'imitwe, impinduka y\'amaso, cyangwa amaguru aremerwa nyuma yo kubyara bishobora kuba eclampsia y\'nyuma bisaba isuzuma rya kliniki vuba. Igiturumbuka gikora cyane ni bwa kamere kandi bituruka ku anemia, kubura amazi, cyangwa guhaguruka vuba.',
    infoEn: 'CLINICAL NOTE: Severe dizziness combined with headache, visual changes, or swollen limbs postpartum may be postpartum pre-eclampsia requiring urgent assessment. Mild frequent dizziness is common and caused by anemia, dehydration, or positional changes.',
    steps: [
      { icon: 'Brain', title: { rw: 'Banza ugenzure ibimenyetso by\'eclampsia', en: 'Check for pre-eclampsia signs first' }, detail: { rw: 'Baza ubwawe: Imitwe ikabije hamwe n\'igiturumbuka? Impinduka z\'amaso? Amaguru aziye ububyimba vuba? Niba yego, hamagara CHW wawe vuba. Niba oya, igiturumbuka gikora cyane gishobora kuvurwa gikiri.', en: 'Ask yourself: severe headache AND dizziness together? Visual changes or blurring? Sudden significant leg swelling? If YES to any, contact your CHW urgently - postpartum pre-eclampsia can occur up to 6 weeks after birth. If NO, continue with the steps below for common positional dizziness.' } },
      { icon: 'Activity', title: { rw: 'Iherezo ry\'imyanya (Orthostatic precautions)', en: 'Positional change precautions' }, detail: { rw: 'Iyo uvanye ku gitanda, banza wicare ku nkari y\'igitanda iminota 1, hanyuma haguruka bugufi. Igiturumbuka itera guhaguruka vuba (orthostatic hypotension) ni bya kamere nyuma yo kubyara kuko amaraso aramanutsa vuba. Guhaguruka bugufi bigabanya igiturumbuka gisa 70% y\'inshuro.', en: 'When getting up from lying down, first sit on the bed edge for 1 full minute, then stand slowly. Dizziness on standing (orthostatic hypotension) is very common postpartum because blood pressure changes quickly with position. This single precaution reduces position-related dizziness in around 70% of cases.' } },
      { icon: 'Utensils', title: { rw: 'Ibyuma na electrolytes', en: 'Iron-rich foods and electrolytes' }, detail: { rw: 'Rya ibiryo bikungahaye kuri ibyuma (imboga z\'icyatsi, ibishyimbo) na electrolytes (igitoki kuri potassium, amata kuri calcium). Igiturumbuka cyane nyuma yo kubyara bikunze guterwa na anemia y\'ibyuma. Suplement y\'ibyuma ishobora gukuraho igiturumbuka mu ndwi 2-4 niba anemia ni ikibazo.', en: 'Eat iron-rich foods (dark leafy greens, beans) and electrolyte foods (banana for potassium, dairy for calcium). Most non-positional dizziness after birth is caused by iron deficiency anemia. Iron supplementation often eliminates this dizziness within 2-4 weeks once anemia is confirmed.' } },
      { icon: 'Phone', title: { rw: 'Saba isuzuma ry\'umuvuduko w\'amaraso na anemia', en: 'Ask for blood pressure and anemia check' }, detail: { rw: 'Bwira CHW wawe ukeneye: (1) gupimwa umuvuduko w\'amaraso - byanga ko uri hejuru cyangwa munsi, (2) isuzuma ry\'amaraso kugira ngo basuzume anemia. Ibi bigenzura ibyo bisaba gufatwa hamwe. CHW ashobora gupima ibyo byombi mu minota 10 mu nzu.', en: 'Tell your CHW you need: (1) blood pressure check - ruling out both high and low readings, and (2) a blood test for anemia. These two checks identify the cause of most postpartum dizziness. Your CHW can do both at a home visit in 10 minutes. Treatment depends on which is found.' } },
    ],
  },

  // ── POSITIVE ────────────────────────────────────────────────────
  okay: {
    headerType: 'positive', reassure: false,
    infoRw: 'Kwinjira uyu munsi ni intsinzi nyakuri. Ubushakashatsi bwa WHO bwerekana ko "days of stability" - iminsi y\'amahoro - ni ibimenyetso by\'iterambere muri PPD. Buri munsi mwiza wongera gutuza ubwonko bwawe kandi ugufasha gukira.',
    infoEn: 'Showing up today is a real achievement. WHO research shows that stable days are measurable recovery markers in PPD. Each day of relative stability strengthens your brain\'s resilience and moves you forward.',
    steps: [
      { icon: 'PenLine', title: { rw: 'Teganya umunsi mwiza', en: 'Plan for a harder day' }, detail: { rw: 'Uyu munsi wumva uri meza - andika amakuru 2 akugeza hano: ni iki wakoreye? Ni iki cyagufashije? Ubu ni ubushakashatsi bwa kliniki - kubona imikoro y\'iminsi myiza ikufasha gusubirayo no kuyikoresha iyo bigoye.', en: 'On this stable day, write 2 things that helped you feel okay: what did you do? what supported you? Research shows that identifying coping strategies on good days and recording them makes them accessible when things feel harder.' } },
      { icon: 'Baby', title: { rw: 'Koresha ingufu zo ubu kuri isano', en: 'Use this energy for bonding' }, detail: { rw: 'Nimuvugane na mwana wawe iminota 10 ubu ndetse ubwumvire cyangwa ukishire. Isano iboneka byoroshye iyo umutima waciye ku byiyumvo bya PPD. Ibikorwa bito bya isano ubu biza gukubuka kandi bifasha PPD gukira.', en: 'Spend 10 minutes actively with your baby right now - talk, sing, make eye contact, or simply hold them calmly. Bonding activities have the most impact when done during stable moments. These small investments add up and support recovery.' } },
      { icon: 'CheckCircle', title: { rw: 'Subiranamo iminsi n\'ibyiyumvo', en: 'Review your patterns' }, detail: { rw: 'Reba iminsi 7 ishize mu gihe cya "Iterambere ryanjye." Subiramo: uyu munsi wimeze ute ugereranije na iminsi mishya? Gutahura impinduka ni ingenzi mu isuzuma rya PPD kandi bifasha CHW wawe kwita neza.', en: 'Go to My Progress and look at your last 7 days. Are the okay days becoming more frequent? Are the difficult days less severe? Tracking this pattern is part of WHO-recommended PPD self-monitoring and gives your CHW accurate information for your care.' } },
    ],
  },
  good: {
    headerType: 'positive', reassure: false,
    infoRw: 'Iterambere ryawe riragaragara! Ubushakashatsi bwerekana ko iminsi myiza yiyongera buhoro iyo PPD ikira. Menya ko iri iterambere rifasha ubwonko bwawe gusubira mu buzima busanzwe.',
    infoEn: 'Your progress is showing! Research shows that good days become more frequent as PPD improves. Recognizing this momentum matters - your brain is actually getting better.',
    steps: [
      { icon: 'BookOpen', title: { rw: 'Andika icyo cyabaye uyu munsi', en: 'Record what made today good' }, detail: { rw: 'Andika kimwe cyangwa kabiri byatumye uyu munsi uhenda: amafi yo kurya? Ikiruhuko? Isano? Urumuri rw\'izuba? Ibi bikugezaho ibitekerezo by\'ubufasha byawe. Kuyandika bifasha ubwonko bwawe gusubira ku myanzuro nziza iyo bigoye.', en: 'Write one or two things that made today feel good: good food, rest, connection, sunshine? This reveals your personal recovery factors. Writing them down allows your brain to consciously return to these when needed.' } },
      { icon: 'Activity', title: { rw: 'Genda hanze n\'umwana wawe', en: 'Walk outside with baby' }, detail: { rw: 'Gerageza guhaguruka n\'umwana wawe hanze iminuta 15-20. Urumuri rw\'izuba rwongerera serotonin no Vitamin D muri mwe bombi. Gutwara mwana hanze ni inzira y\'isano, imyitozo, no kugabanya PPD igihe kimwe.', en: 'Try to get outside for 15-20 minutes with your baby. Sunlight benefits you both - it increases serotonin in you and supports Vitamin D for baby\'s development. Walking with baby combines bonding, movement, and light therapy into one activity.' } },
      { icon: 'Users', title: { rw: 'Sangira ibyishimo na mugenzi wawe', en: 'Share this good day with someone' }, detail: { rw: 'Tuma ubutumwa buto kuri mugenzi cyangwa umubyeyi usangiye amakuru meza y\'uyu munsi. Gutumanahana isano ya sosiyale igira ingaruka nziza ku buzima bw\'ubwonko. Inshuti iwe irashimishwa no kumva ko uri neza.', en: 'Send a short message to a friend or family member sharing something good from today. Social sharing on good days maintains the connections that support you on harder days. And the people who care about you want to hear when you are doing well.' } },
    ],
  },
  happy: {
    headerType: 'positive', reassure: false,
    infoRw: 'Ibyishimo byo nyakuri! Ubushakashatsi bwerekana ko ibyiyumvo byiza (positive emotions) bifasha ubwonko gukira PPD birovugwa nka "broaden-and-build theory" - ubwonko bwunguka ubushobozi iyo hari ibyishimo.',
    infoEn: 'Genuine happiness supports recovery directly. Research on the "broaden-and-build theory" of positive emotions shows that joy expands your brain\'s capacity and literally builds psychological resilience - this is evidence-based, not just feel-good advice.',
    steps: [
      { icon: 'PenLine', title: { rw: 'Ibitabo by\'ibyishimo kuri PPD', en: 'Happiness journal for recovery' }, detail: { rw: 'Andika impamvu 3 z\'ibyishimo byawe uyu munsi. Niba ubisoma mu minsi ikomeye, ubwonko bwawe bubona ibimenyetso by\'igihe cyo mbere ko ibyishimo birashoboka. Ubushakashatsi bwerekana ko ibi bigarura amahoro vuba kuruta gutekereza gusa.', en: 'Write 3 reasons you are happy today. When you read this on a harder day, your brain sees evidence from your own experience that happiness is possible. Research shows this is more effective for mood recovery than general positive thinking.' } },
      { icon: 'Baby', title: { rw: 'Guseka na mwana wawe', en: 'Laugh with your baby' }, detail: { rw: 'Sangira mwana wawe ibyishimo byawe - guseka, kwiyunguruza, gupiga intoki hamwe. Guseka kurerekana oxytocin muri mwe bombi. Ibihe by\'ibyishimo bya mbere hagati ya nyina na mwana biza kubuka kuri mwana igihe gita.', en: 'Share your happiness with your baby through laughing, moving together, or making silly faces. Laughter releases oxytocin in both of you. Happy early interactions are what your baby\'s developing brain stores as the foundation of attachment.' } },
      { icon: 'Heart', title: { rw: 'Gushimira umubiri wawe', en: 'Appreciate what your body did' }, detail: { rw: 'Uyu munsi, tekereza ubushobozi bw\'umubiri wawe: wabyaye muntu, ukomeza kumurisha. Umubiri wawe ni intwari. Gushimira umubiri wawe bigira ingaruka nziza ku kwiyemera no gukira PPD.', en: 'Today, think about what your body has done: it grew a person, delivered them, and is now nourishing them. Your body performed something extraordinary. Appreciating your body specifically - rather than just your situation - has measurable positive effects on PPD recovery and self-esteem.' } },
    ],
  },
  grateful: {
    headerType: 'positive', reassure: false,
    infoRw: 'Gushimira ni uburyo bushingiye ku bwonko bw\'ubuvuzi. Ubushakashatsi bwa Dr. Robert Emmons werekana ko kwandika ibintu bishimishwa bitatatu buri munsi bigabanya ibimenyetso bya PPD 25% mu ndwi 4 gusa.',
    infoEn: 'Gratitude is a clinically validated intervention. Research by Dr. Robert Emmons shows that writing three things you are grateful for daily reduces PPD symptoms by 25% in just 4 weeks. This is not just positivity - it literally rewires neural patterns.',
    steps: [
      { icon: 'PenLine', title: { rw: 'Ibintu 3 by\'igihe gito bigaragaza ahantu', en: '3 specific small gratitudes' }, detail: { rw: 'Andika ibintu 3 ndetse n\'ibito: "Nshimira amazi meza uyu munsi." "Nshimira umwana wanjye antegereza." "Nshimira isaha imwe yo kuruhuka." Ibitangwa birya gusa ku buzima bugenzi bizi. Iminyantige ibasha gusubira ku bihe bibi.', en: 'Write 3 specific small things: "I am grateful for the clean water today." "I am grateful my baby is healthy." "I am grateful for the hour of rest." Specific small gratitudes build more neural resilience than general statements. They anchor your brain to concrete evidence of goodness in your life.' } },
      { icon: 'Users', title: { rw: 'Sangira n\'abandi mu Our Circle', en: 'Share in Our Circle' }, detail: { rw: 'Andika kimwe muri "Inzira Yacu" - icyo ushimira uyu munsi. Abanyina bandi bakeneye kumva ibitekerezo by\'iterambere n\'ibyishimo nk\'uko bakeneye inkunga. Ubutumwa bwawe bufasha no kumva ubutumwa bw\'abandi.', en: 'Post one thing you are grateful for in Our Circle. Other mothers need to hear words of progress and gratitude as much as they need support. Your message may be the bright moment in another mother\'s difficult day.' } },
      { icon: 'Leaf', title: { rw: 'Ibuka inzira watoye', en: 'Honour how far you have come' }, detail: { rw: 'Tekereza inzira watoye uhereye ku munsi wa mbere. Uriho, wisunga, kandi ibyo ni ikimenyetso cy\'imbaraga z\'ingufu. WHO igena gushimira gusesengura nk\'uburyo bw\'ubuzima rusange bufite akamaro mu gukira indwara z\'ubwonko.', en: 'Reflect on your journey since the beginning. You are here, you are seeking support, and that is a sign of real strength. WHO includes gratitude practices in its psychosocial wellbeing interventions because the evidence for their effect on mental health recovery is strong.' } },
    ],
  },
};

const CATEGORIES = {
  emotion:  { rw: 'Ibyiyumvo', en: 'How I feel emotionally' },
  physical: { rw: 'Umubiri wanjye', en: 'My body' },
  positive: { rw: 'Neza', en: 'Feeling well' },
};

export default function Journal() {
  const { lang, today, entries, saveEntry, t } = useApp();
  const { speak, stop, speaking } = useSpeech();

  const buildReadText = (data: FeelingData, feelingKey: string) => {
    const label = FEELINGS.find(f => f.key === feelingKey)?.[lang] ?? feelingKey;
    const intro = lang === 'rw' ? `Dore inama zawe zerekeye ${label}.` : `Here is your support for ${label}.`;
    const info = lang === 'rw' ? data.infoRw : data.infoEn;
    const stepsIntro = lang === 'rw' ? 'Ibi ushobora gukora none none.' : 'What you can do right now.';
    const steps = data.steps.map(s => `${s.title[lang]}. ${s.detail[lang]}`).join(' ');
    return `${intro} ${info} ${stepsIntro} ${steps}`;
  };

  const [currentPhase, setCurrentPhase] = useState<Phase>(
    today?.feeling && RESPONSES[today.feeling] ? 'response' : 'write'
  );
  const [text, setText] = useState(today?.journalText ?? '');
  const [chosenFeeling, setChosenFeeling] = useState<string | null>(today?.feeling || null);
  const [responseData, setResponseData] = useState<FeelingData | null>(
    today?.feeling ? (RESPONSES[today.feeling] ?? null) : null
  );
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const speechSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = lang === 'rw' ? 'rw-RW' : 'en-US';
    r.continuous = true; r.interimResults = true;
    r.onresult = (e: any) => {
      let t = '';
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      setText(t);
    };
    r.onend = () => setRecording(false);
    r.start(); recognitionRef.current = r; setRecording(true);
  };
  const stopVoice = () => { recognitionRef.current?.stop(); setRecording(false); };

  const handleSend = () => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setCurrentPhase('feelings'); }, 800);
  };

  const handleFeeling = (key: string) => {
    setChosenFeeling(key);
    setLoading(true);
    setTimeout(() => {
      const data = RESPONSES[key];
      setResponseData(data);
      saveEntry({ journalText: text.trim(), feeling: key, aiResponse: JSON.stringify(data) });
      setLoading(false);
      setCurrentPhase('response');
    }, 700);
  };

  const handleReset = () => {
    setCurrentPhase('write'); setChosenFeeling(null); setResponseData(null); setText('');
  };

  const past = entries
    .filter(e => e.journalText && e.date !== new Date().toISOString().split('T')[0])
    .sort((a, b) => b.date.localeCompare(a.date)).slice(0, 15);

  const fmt = (iso: string) => new Date(iso).toLocaleDateString(
    lang === 'rw' ? 'fr-RW' : 'en-GB', { day: 'numeric', month: 'short' }
  );
  const feelingLabel = (key: string) => {
    const f = FEELINGS.find(f => f.key === key);
    return f ? (lang === 'rw' ? f.rw : f.en) : key;
  };
  const feelingColor = (key: string) => FEELINGS.find(f => f.key === key)?.border ?? 'var(--green-400)';

  return (
    <div className="page" style={{ maxWidth: 780 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="section-title">{t('journal')}</h1>
          <p className="section-sub" style={{ marginBottom: 0 }}>
            {lang === 'rw' ? 'Andika ibyiyumvo byawe uko bishaka. Nta mategeko.' : 'Write freely. No rules, no judgment.'}
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? (lang === 'rw' ? 'Subira' : 'Back') : t('history')}
        </button>
      </div>

      {/* ── HISTORY ── */}
      {showHistory ? (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 13, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
            {lang === 'rw' ? 'Ibitabo bya vuba' : 'Past entries'}
          </div>
          {past.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: 'var(--gray-500)' }}>{lang === 'rw' ? 'Nta makuru yabonetse.' : 'No past entries yet.'}</div>}
          {past.map(e => {
            let parsed: FeelingData | null = null;
            try { parsed = JSON.parse(e.aiResponse); } catch {}
            return (
              <div key={e.date} style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)' }}>{fmt(e.date)}</span>
                  {e.feeling && (
                    <span style={{ fontSize: 12, background: 'var(--green-100)', color: 'var(--green-700)', borderRadius: 100, padding: '2px 10px', fontWeight: 600 }}>
                      {feelingLabel(e.feeling)}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.6, marginBottom: parsed ? 10 : 0 }}>{e.journalText}</p>
                {parsed && (
                  <div style={{ background: 'var(--green-50)', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: 'var(--green-700)', borderLeft: '3px solid var(--green-400)' }}>
                    <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>{lang === 'rw' ? parsed.infoRw : parsed.infoEn}</p>
                    {parsed.steps?.slice(0, 2).map((s: StepItem) => (
                      <div key={s.title[lang]} style={{ display: 'flex', gap: 7, marginTop: 5, alignItems: 'flex-start' }}>
                        <Icon name={s.icon} size={13} color="var(--green-700)" />
                        <span><strong>{s.title[lang]}:</strong> {s.detail[lang]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <>
          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 4, alignItems: 'center' }}>
            {(['write', 'feelings', 'response'] as Phase[]).map((p, i) => {
              const labels: Record<Phase, Record<Lang, string>> = {
                write:    { rw: 'Andika',    en: 'Write' },
                feelings: { rw: 'Wumva ute', en: 'Feeling' },
                response: { rw: 'Inama',     en: 'Support' },
              };
              const active = currentPhase === p;
              const done = ['write','feelings','response'].indexOf(currentPhase) > i;
              return (
                <React.Fragment key={p}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', fontSize: 11, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: active ? 'var(--green-700)' : done ? 'var(--green-100)' : 'var(--gray-200)',
                      color: active ? 'var(--white)' : done ? 'var(--green-700)' : 'var(--gray-400)',
                    }}>{done ? '✓' : i + 1}</div>
                    <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? 'var(--green-700)' : 'var(--gray-400)' }}>
                      {labels[p][lang]}
                    </span>
                  </div>
                  {i < 2 && <div style={{ flex: 1, height: 1, background: done ? 'var(--green-200)' : 'var(--gray-200)', maxWidth: 40 }} />}
                </React.Fragment>
              );
            })}
          </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── WRITE ── */}
          {currentPhase === 'write' && (
            <div className="card card-pad">
              <div style={{ marginBottom: 14 }}>
                <label className="label" style={{ marginBottom: 4 }}>{lang === 'rw' ? 'Ibitabo byanjye wa none' : "Today's entry"}</label>
                <p style={{ fontSize: 13, color: 'var(--gray-500)', margin: 0 }}>
                  {lang === 'rw'
                    ? 'Andika icyo wumva uyu munsi. Nyuma, tuzakubaza uko wumva kandi tukaguha inama z\'ubuzima.'
                    : 'Write how you feel today. Then we will ask how you are feeling and give you health support based on your answer.'}
                </p>
              </div>
              <textarea className="input" placeholder={t('write')} value={text} onChange={e => setText(e.target.value)}
                style={{ minHeight: 180, marginBottom: 14 }} maxLength={3000} />
              {speechSupported && (
                <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mic size={13} strokeWidth={2} /> {t('voiceHint')}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                {speechSupported && (
                  <button className={`voice-btn${recording ? ' recording' : ''}`} onClick={recording ? stopVoice : startVoice}>
                    {recording ? <MicOff size={15} strokeWidth={2} /> : <Mic size={15} strokeWidth={2} />}
                    {recording ? t('voiceStop') : t('voiceStart')}
                    {recording && <span style={{ fontSize: 12, opacity: .8 }}> {lang === 'rw' ? 'Vuga...' : 'Listening...'}</span>}
                  </button>
                )}
                <button className="btn btn-primary" onClick={handleSend} disabled={!text.trim() || loading}
                  style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {loading ? (lang === 'rw' ? 'Gutegereza...' : 'Reading...') : <><Send size={14} strokeWidth={2} /> {t('send')}</>}
                </button>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--gray-400)', textAlign: 'right' }}>{text.length}/3000</div>
            </div>
          )}

          {/* ── CHOOSE FEELING ── */}
          {currentPhase === 'feelings' && (
            <div className="card card-pad">
              <div style={{ background: 'var(--gray-100)', borderRadius: 8, padding: '12px 14px', fontSize: 14, color: 'var(--gray-600)', marginBottom: 20, fontStyle: 'italic', lineHeight: 1.6 }}>
                "{text}"
              </div>
              <div style={{ background: 'var(--green-50)', border: '1px solid var(--green-100)', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--green-800)', marginBottom: 3 }}>
                  {lang === 'rw' ? 'Ndakumva. Ubu wumva ute?' : 'I hear you. How are you feeling right now?'}
                </div>
                <p style={{ fontSize: 13, color: 'var(--green-700)', margin: 0 }}>
                  {lang === 'rw'
                    ? 'Hitamo ikintu kimwe gishoboka. Tuzaguha inama z\'ubuzima zigenewe ibyiyumvo byawe.'
                    : 'Pick the closest one. We will give you health guidance specific to what you chose.'}
                </p>
              </div>

              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--green-700)', fontSize: 14 }}>
                  <span style={{ animation: 'pulse 1s infinite' }}>●</span>
                  {lang === 'rw' ? 'Ndatekereza...' : 'Understanding your response...'}
                </div>
              ) : (
                (['emotion', 'physical', 'positive'] as const).map(cat => {
                  const items = FEELINGS.filter(f => f.category === cat);
                  return (
                    <div key={cat} style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {cat === 'physical' && <Activity size={12} strokeWidth={2} />}
                        {cat === 'emotion' && <Brain size={12} strokeWidth={2} />}
                        {CATEGORIES[cat][lang]}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                        {items.map(f => (
                          <button key={f.key} onClick={() => handleFeeling(f.key)}
                            style={{
                              padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${f.border}`,
                              background: f.bg, cursor: 'pointer', textAlign: 'left',
                              fontSize: 13, fontWeight: 600, color: 'var(--gray-800)',
                              transition: 'opacity .15s', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '.8')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                          >
                            {lang === 'rw' ? f.rw : f.en}
                            <ChevronRight size={14} strokeWidth={2} color="var(--gray-400)" style={{ flexShrink: 0 }} />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── RESPONSE ── */}
          {currentPhase === 'response' && responseData && (
            <>
              {/* Entry + feeling chip + listen button */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ background: 'var(--gray-100)', borderRadius: 8, padding: '12px 14px', fontSize: 14, color: 'var(--gray-600)', fontStyle: 'italic', lineHeight: 1.6, flex: 1 }}>
                  "{text}"
                </div>
                {chosenFeeling && (
                  <span style={{ fontSize: 13, background: 'var(--white)', border: `1.5px solid ${feelingColor(chosenFeeling)}`, color: 'var(--gray-800)', borderRadius: 100, padding: '5px 14px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {feelingLabel(chosenFeeling)}
                  </span>
                )}
              </div>

              {/* Listen toggle */}
              <button
                onClick={() => {
                  if (speaking) { stop(); return; }
                  if (chosenFeeling && responseData) speak(buildReadText(responseData, chosenFeeling), lang);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 18px', borderRadius: 24,
                  border: `1.5px solid ${speaking ? '#B45309' : 'var(--green-300)'}`,
                  background: speaking ? '#FEF3C7' : 'var(--green-50)',
                  color: speaking ? '#B45309' : 'var(--green-700)',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  transition: 'all .2s', alignSelf: 'flex-start',
                  animation: speaking ? 'pulse 1.2s infinite' : 'none',
                }}
              >
                {speaking
                  ? <><Pause size={15} strokeWidth={2} /> {lang === 'rw' ? 'Hagarika' : 'Stop reading'}</>
                  : <><Volume2 size={15} strokeWidth={2} /> {lang === 'rw' ? 'Wumva ijwi' : 'Listen to this'}</>
                }
              </button>

              {/* Info card */}
              <div style={{
                background: responseData.headerType === 'positive' ? 'var(--green-50)' : responseData.headerType === 'physical' ? '#F3EFFE' : 'var(--green-50)',
                border: `1.5px solid ${responseData.headerType === 'physical' ? '#C4B5FD' : 'var(--green-100)'}`,
                borderRadius: 14, padding: '18px 20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  {responseData.headerType === 'ppd' && <Brain size={17} strokeWidth={1.8} color="var(--green-700)" />}
                  {responseData.headerType === 'physical' && <Activity size={17} strokeWidth={1.8} color="#7C3AED" />}
                  {responseData.headerType === 'positive' && <CheckCircle size={17} strokeWidth={1.8} color="var(--green-700)" />}
                  <span style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.5px', color: responseData.headerType === 'physical' ? '#7C3AED' : 'var(--green-700)' }}>
                    {responseData.headerType === 'ppd'      ? (lang === 'rw' ? 'Ibi ni ibimenyetso bya PPD' : 'This is a PPD symptom') :
                     responseData.headerType === 'physical' ? (lang === 'rw' ? 'Inyandiko y\'ubuzima' : 'About your body') :
                                                               (lang === 'rw' ? 'Iterambere ryawe' : 'Your progress')}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.7, margin: responseData.reassure ? '0 0 12px 0' : 0 }}>
                  {lang === 'rw' ? responseData.infoRw : responseData.infoEn}
                </p>
                {responseData.reassure && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--white)', borderRadius: 10, border: '1px solid var(--green-100)' }}>
                    <CheckCircle size={15} strokeWidth={2} color="var(--green-600)" />
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--green-700)', margin: 0 }}>
                      {lang === 'rw'
                        ? 'Ntugire impungenge. Ibi bishobora kuvurwa. Ntabwo ari ikosa ryawe.'
                        : 'You do not need to worry. This is treatable. You are not a bad mother.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-700)' }}>
                  {lang === 'rw' ? 'Ibi ushobora gukora none none:' : 'What you can do right now:'}
                </div>
                {responseData.steps.map((step: StepItem) => (
                  <div key={step.title[lang]} style={{
                    display: 'flex', gap: 14, alignItems: 'flex-start',
                    background: 'var(--white)', border: '1px solid var(--border)',
                    borderRadius: 12, padding: '14px 16px',
                  }}>
                    <div style={{ color: 'var(--green-600)', flexShrink: 0, marginTop: 2 }}>
                      <Icon name={step.icon} size={20} color="var(--green-600)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-900)', marginBottom: 3 }}>{step.title[lang]}</div>
                      <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.55 }}>{step.detail[lang]}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn btn-outline btn-sm" onClick={handleReset} style={{ alignSelf: 'flex-start' }}>
                {lang === 'rw' ? 'Andika indi nkuru' : 'Write another entry'}
              </button>
            </>
          )}
        </div>
        </>
      )}
    </div>
  );
}
