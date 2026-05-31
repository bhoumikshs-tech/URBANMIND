import { useState, useEffect, useRef, FormEvent, KeyboardEvent } from 'react';
import { Shield, Sparkles, Mail, Phone, Lock, KeyRound, ArrowRight, CornerDownRight, RotateCcw, HelpCircle, Check, MapPin, Building, Volume1 } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (operator: { name: string; badge: string; contact: string; type: 'email' | 'mobile' }) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [authMethod, setAuthMethod] = useState<'email' | 'mobile'>('email');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [customName, setCustomName] = useState('');
  const [customBadge, setCustomBadge] = useState('');

  // OTP State Machine
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const [timeLeft, setTimeLeft] = useState(60);
  const [errorMessage, setErrorMessage] = useState('');
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  // Refs for OTP digital input auto-focus
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Mock accounts for quick selection / testing
  const mockOfficerAccounts = [
    { name: 'INSP. B. SHARMA', email: 'sharma@bengalurupolice.gov.in', phone: '9876543210', badge: 'BEAT NO. 14 ACTIVE' },
    { name: 'INSP. ANANYA RAO', email: 'rao.a@bengalurupolice.gov.in', phone: '9845012345', badge: 'CORE ZONE 08 ACTIVE' },
    { name: 'COMMISSIONER PATIL', email: 'patil@bengalurupolice.gov.in', phone: '9123456789', badge: 'HQ COMMAND ROOM' },
  ];

  // Tick down timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, timeLeft]);

  // Handle single digit OTP keystrokes
  const handleOtpChange = (value: string, index: number) => {
    // Only allow single numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
    setErrorMessage('');

    // Advance focus on numerical inputs
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Backspace key handling in multi-OTP fields
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        // Back up focus and clear previous field
        const newOtpDigits = [...otpDigits];
        newOtpDigits[index - 1] = '';
        setOtpDigits(newOtpDigits);
        inputRefs.current[index - 1]?.focus();
      } else if (otpDigits[index]) {
        // Just clear current box
        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = '';
        setOtpDigits(newOtpDigits);
      }
    }
  };

  // Quick select a demo account
  const handleSelectMockAccount = (acc: typeof mockOfficerAccounts[0]) => {
    if (authMethod === 'email') {
      setEmailInput(acc.email);
    } else {
      setPhoneInput(acc.phone);
    }
    setCustomName(acc.name);
    setCustomBadge(acc.badge);
    setErrorMessage('');
  };

  // Trigger dispatch of simulated OTP token
  const handleSendOtp = (e: FormEvent) => {
    e.preventDefault();

    // Verification check for inputs
    if (authMethod === 'email') {
      if (!emailInput || !emailInput.includes('@')) {
        setErrorMessage('Please enter a valid municipal police email coordinate.');
        return;
      }
    } else {
      if (!phoneInput || phoneInput.length < 9) {
        setErrorMessage('Please enter a valid 10-digit telemetry wireless link.');
        return;
      }
    }

    // Generate secure 6-digit random token
    const secureToken = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(secureToken);
    setOtpDigits(Array(6).fill(''));
    setOtpSent(true);
    setTimeLeft(60);
    setErrorMessage('');

    // Pre-fill officer details based on mock index if not custom, or assign default template
    if (!customName) {
      const match = mockOfficerAccounts.find(acc => 
        (authMethod === 'email' && acc.email.toLowerCase() === emailInput.toLowerCase()) ||
        (authMethod === 'mobile' && acc.phone === phoneInput)
      );
      if (match) {
        setCustomName(match.name);
        setCustomBadge(match.badge);
      } else {
        // Generate neat fallback
        const ext = authMethod === 'email' ? emailInput.split('@')[0].toUpperCase() : phoneInput.substring(6);
        setCustomName(`OPERATOR K.${ext.substring(0, 4)}`);
        setCustomBadge(`BEAT FIELD SECURE - ZONE R`);
      }
    }

    // Trigger gorgeous UI toast notification showing simulated secure network message
    const identifier = authMethod === 'email' ? emailInput : `${countryCode} ${phoneInput}`;
    setNotification({
      message: `🔐 [SANDBOX TELEMETRY DISPATCH]\nTOKEN SENT TO: ${identifier}\nVERIFICATION SECURE KEY: ${secureToken}`,
      visible: true
    });

    // Automatically focus inside the first digit block of OTP
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);
  };

  // Submit and verify OTP matching
  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault();
    const joinedCode = otpDigits.join('');

    if (joinedCode.length < 6) {
      setErrorMessage('Verification block incomplete. Code must be 6 digits.');
      return;
    }

    if (joinedCode !== generatedOtp) {
      setErrorMessage('Decryption fail. Safety token code invalid.');
      return;
    }

    // Success login sequence
    onLoginSuccess({
      name: customName || 'INSP. DEMO GUEST',
      badge: customBadge || 'COMMAND CENTRAL STABLE',
      contact: authMethod === 'email' ? emailInput : `${countryCode} ${phoneInput}`,
      type: authMethod
    });
  };

  // Reset screen view
  const handleReset = () => {
    setOtpSent(false);
    setOtpDigits(Array(6).fill(''));
    setGeneratedOtp('');
    setErrorMessage('');
    setNotification({ message: '', visible: false });
  };

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex items-center justify-center relative p-4 scrollbar-thin select-none overflow-y-auto">
      {/* Visual matrix and lighting details */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-accent-purple/3 rounded-full blur-2xl pointer-events-none" />

      {/* Floating Interactive Toast Sandbox Telemetry OTP Generator */}
      {notification.visible && (
        <div id="otp-sandbox-toast" className="fixed top-6 right-6 left-6 md:left-auto md:w-[420px] bg-slate-950 border-2 border-emerald-500/80 p-4 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.30)] z-50 animate-fadeIn font-mono text-xs flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <span className="text-[10px] uppercase font-black text-emerald-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Secure Token Dispatcher
            </span>
            <button 
              onClick={() => setNotification(prev => ({ ...prev, visible: false }))}
              className="text-slate-450 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-200 uppercase whitespace-pre-line leading-relaxed tracking-wider font-semibold">
            {notification.message}
          </p>
          <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-lg text-emerald-400 font-bold mt-1">
            <span>OTP TOKEN CODE:</span>
            <span className="text-sm tracking-widest text-shadow-glow font-black">{generatedOtp}</span>
          </div>
          <span className="text-[9px] text-slate-500 mt-1 uppercase italic">*Click the code above to mock-copy or enter it in the boxes below</span>
        </div>
      )}

      {/* Primary Dashboard Container Panel */}
      <div className="max-w-[1040px] w-full grid grid-cols-1 lg:grid-cols-12 bg-[#0a0b0d]/90 border border-border-dark/80 rounded-3xl overflow-hidden shadow-2xl relative z-10 min-h-[580px]">
        
        {/* LEFT COLUMN: Visual Branding Showcase Context Panel (col-span-4) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-panel-dark to-black p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border-dark select-none">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-accent-blue/10 border border-accent-blue/40 flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-accent-cyan" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono font-extrabold tracking-widest text-white">URBANMIND</span>
                <span className="text-[9px] font-mono font-bold text-accent-cyan">POLICE GRID v4.1</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-2">
              <h1 className="text-lg font-bold text-slate-100 font-sans uppercase tracking-tight">Bengaluru Urban Mobility Control</h1>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Unified spatial telemetry command portal. Access is encrypted and authorized strictly under state traffic cyber frameworks.
              </p>
            </div>
          </div>

          {/* Map metadata overview nodes */}
          <div className="flex flex-col gap-3 py-6 my-4 border-t border-b border-slate-900 font-mono text-[10px]">
            <span className="text-slate-500 uppercase tracking-widest">Active Server Contexts:</span>
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
              <span>Host Node: BNG_CO_SOUTHWest</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Building className="w-3.5 h-3.5 text-accent-purple shrink-0" />
              <span>Client: Bengaluru Traffic Command</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span>YOLOv8 & LSTM models online</span>
            </div>
          </div>

          <p className="text-[9px] font-mono text-slate-500 leading-normal uppercase">
            ⚠️ UNAUTHORIZED SEIZURES WILL BE LOGGED IPS_GRID COMPLIANCE.
          </p>
        </div>

        {/* RIGHT COLUMN: Interactive Login Form panel (col-span-8) */}
        <div className="lg:col-span-8 p-6 sm:p-10 flex flex-col justify-center">
          
          {!otpSent ? (
            /* PHASE 1: ENTER EMAIL / MOBILE */
            <div className="flex flex-col gap-6 w-full max-w-[460px] mx-auto animate-fadeIn">
              <div className="flex flex-col gap-1.5">
                <div className="inline-flex items-center gap-1.5 text-accent-cyan font-mono text-[9px] font-bold uppercase tracking-widest">
                  <Sparkles className="w-3 h-3 text-accent-cyan" /> Secure Infrastructure Entrance
                </div>
                <h2 className="text-2xl font-black font-sans uppercase tracking-tight text-white">Officer Authentication</h2>
                <p className="text-xs text-slate-400">Select credentials path and request temporal OTP security clearance pass.</p>
              </div>

              {/* Selector Tabs between Email & Mobile numbers */}
              <div className="grid grid-cols-2 p-1 bg-black/60 rounded-xl border border-border-dark/60 select-none">
                <button
                  onClick={() => { setAuthMethod('email'); setErrorMessage(''); }}
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    authMethod === 'email'
                      ? 'bg-accent-blue text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> Police Email
                </button>
                <button
                  onClick={() => { setAuthMethod('mobile'); setErrorMessage(''); }}
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    authMethod === 'mobile'
                      ? 'bg-accent-blue text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" /> Wireless Mobile
                </button>
              </div>

              {/* Error Warning Indicator */}
              {errorMessage && (
                <div className="bg-red-950/40 border border-red-900/60 p-3 rounded-xl flex items-start gap-2.5 text-xs font-mono text-red-400 animate-slideUp">
                  <span className="text-base">⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Real Input Portal Area */}
              <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                {authMethod === 'email' ? (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="police-email" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Municipal Command Email Directory
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        id="police-email"
                        type="email"
                        placeholder="e.g. sharma@bengalurupolice.gov.in"
                        value={emailInput}
                        onChange={(e) => { setEmailInput(e.target.value); setErrorMessage(''); }}
                        className="w-full pl-10 pr-4 py-3.5 bg-black/40 border border-border-dark/80 rounded-xl font-mono text-xs text-white placeholder-slate-600 focus:outline-none focus:border-accent-cyan/80 transition-all shadow-inner"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="police-phone" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Registered Officer Phone Link
                    </label>
                    <div className="flex gap-2">
                      <select
                        id="police-phone-cc"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-black/40 border border-border-dark/80 hover:border-slate-800 rounded-xl px-3 text-xs font-mono text-slate-300 focus:outline-none cursor-pointer"
                      >
                        <option value="+91">+91 (IN)</option>
                        <option value="+1">+1 (US)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+65">+65 (SG)</option>
                      </select>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          id="police-phone"
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={phoneInput}
                          onChange={(e) => { setPhoneInput(e.target.value.replace(/\D/g, '')); setErrorMessage(''); }}
                          className="w-full pl-10 pr-4 py-3.5 bg-black/40 border border-border-dark/80 rounded-xl font-mono text-xs text-white placeholder-slate-600 focus:outline-none focus:border-accent-cyan/80 transition-all shadow-inner"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Highly customizable Officer parameters */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="officer-name-input" className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Officer Name (Optional)</label>
                    <input
                      id="officer-name-input"
                      type="text"
                      placeholder="Custom e.g. B. SHARMA"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-3 py-2 bg-black/45 border border-border-dark/60 rounded-lg text-[11px] font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="officer-badge-input" className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Beat/Badge No (Optional)</label>
                    <input
                      id="officer-badge-input"
                      type="text"
                      placeholder="Custom e.g. BEAT NO. 14"
                      value={customBadge}
                      onChange={(e) => setCustomBadge(e.target.value)}
                      className="w-full px-3 py-2 bg-black/45 border border-border-dark/60 rounded-lg text-[11px] font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                <button
                  id="btn-login-generate-otp"
                  type="submit"
                  className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-blue font-mono text-xs font-bold text-white transition hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Generate Security OTP Passcode <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* DEMO ACCOUNTS HELPER BOX - EXCELLENT FOR QUICK TESTING */}
              <div className="border border-border-dark/45 bg-[#08090a]/40 p-4 rounded-2xl flex flex-col gap-2.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-accent-purple" /> Simulated Accounts Quick-Portal
                </span>
                <p className="text-[10px] text-slate-500">Select any preconfigured credentials to bypass manual typing and auto-populate name metadata:</p>
                <div className="flex flex-col gap-1.5">
                  {mockOfficerAccounts.map((acc, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectMockAccount(acc)}
                      className="w-full py-2 px-3 rounded-xl bg-black/60 border border-slate-900 hover:border-accent-cyan/45 text-left transition flex items-center justify-between text-[11px] font-mono hover:bg-black/90 group cursor-pointer"
                    >
                      <span className="text-slate-300 flex items-center gap-1">
                        <CornerDownRight className="w-3 h-3 text-slate-600" />
                        {acc.name}
                      </span>
                      <span className="text-slate-500 group-hover:text-accent-cyan transition text-[10px]">
                        {authMethod === 'email' ? acc.email : acc.phone}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* PHASE 2: VERIFY EXCLUSIVE SECURITY TOKEN */
            <div className="flex flex-col gap-6 w-full max-w-[460px] mx-auto animate-fadeIn select-none">
              <div className="flex flex-col gap-1.5">
                <div className="inline-flex items-center gap-1.5 text-accent-purple font-mono text-[9px] font-bold uppercase tracking-widest">
                  <Lock className="w-3 h-3 text-accent-purple animate-pulse" /> Decryption Gateway Active
                </div>
                <h2 className="text-2xl font-black font-sans uppercase tracking-tight text-white font-sans">Verify Security OTP</h2>
                {authMethod === 'email' ? (
                  <p className="text-xs text-slate-400">
                    A numerical verification key is dispatched to <span className="font-bold text-accent-cyan">{emailInput}</span>.
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">
                    A wireless network OTP token is dispatched to <span className="font-bold text-accent-cyan">{countryCode} {phoneInput}</span>.
                  </p>
                )}
              </div>

              {/* Error Warning Indicator */}
              {errorMessage && (
                <div className="bg-red-950/40 border border-red-900/60 p-3 rounded-xl flex items-start gap-2.5 text-xs font-mono text-red-400 animate-slideUp">
                  <span className="text-base">⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Six Bounded Numeric Boxes representing input */}
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block text-center">
                    Enter Decentralized 6-Digit Passphrase Key
                  </span>
                  
                  {/* Digital OTP Enter block */}
                  <div className="flex justify-between gap-2.5 sm:gap-3 select-none">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        maxLength={1}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={otpDigits[index]}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-11 h-12 sm:w-12 sm:h-14 bg-black/60 border-2 border-border-dark/80 rounded-xl font-mono text-lg font-bold text-center text-accent-cyan focus:outline-none focus:border-accent-cyan focus:shadow-[0_0_12px_rgba(6,182,212,0.30)] transition duration-150 shadow-inner"
                      />
                    ))}
                  </div>
                </div>

                {/* Submitting Code Trigger */}
                <button
                  id="btn-login-verify-submit"
                  type="submit"
                  className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-accent-purple font-mono text-xs font-bold text-white transition hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Decrypt & Unlock Control Console <ArrowRight className="w-4 h-4" />
                </button>

                {/* Timer management & countdown metrics */}
                <div className="flex items-center justify-between font-mono text-[11px] border-t border-slate-900/80 pt-4 mt-2">
                  {timeLeft > 0 ? (
                    <span className="text-slate-400 flex items-center gap-1">
                      Resend available in{' '}
                      <span className="text-accent-cyan font-bold font-mono">{timeLeft}s</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        // Resend triggered
                        const secureToken = Math.floor(100000 + Math.random() * 900000).toString();
                        setGeneratedOtp(secureToken);
                        setOtpDigits(Array(6).fill(''));
                        setTimeLeft(60);
                        setErrorMessage('');
                        const identifier = authMethod === 'email' ? emailInput : `${countryCode} ${phoneInput}`;
                        setNotification({
                          message: `⚡ [RESENT SECURE TELEMETRY TOKEN]\nDESTINATION: ${identifier}\nTOKEN CODE: ${secureToken}`,
                          visible: true
                        });
                        setTimeout(() => inputRefs.current[0]?.focus(), 100);
                      }}
                      className="text-accent-cyan font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Re-Dispatch Token SMS/Email
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-slate-500 hover:text-slate-300 transition cursor-pointer"
                  >
                    Change Credentials Contact
                  </button>
                </div>
              </form>

              {/* Inline Sandbox telemetry Helper hints */}
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-900 text-[10px] font-mono text-slate-500 flex gap-2 items-start leading-relaxed leading-normal select-none">
                <HelpCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                <span>
                  Testing sandbox mode is fully active. Observe the glowing toast notification at the top to receive and input the valid 6-digit key pattern.
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
