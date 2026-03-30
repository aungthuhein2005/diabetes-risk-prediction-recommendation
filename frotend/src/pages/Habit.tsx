import {
    Activity,
    Baby,
    Droplet,
    Gauge,
    Ruler,
    TestTube,
    UserRound,
    Weight,
    Info
  } from 'lucide-react'
  import { useNavigate } from 'react-router-dom'
  import Button from '../components/Button'
  import Card from '../components/Card'
  import FeatureInput from '../components/FeatureInput'
  import ProgressBar from '../components/ProgressBar'
  import type { HabitAnswers } from '../types/assessment'
  
  type HabitPageProps = {
    answers: HabitAnswers
    onChange: (nextAnswers: HabitAnswers) => void
  }
  
  export default function HabitPage({ answers, onChange }: HabitPageProps) {
    const navigate = useNavigate()
  
    // Helper to keep the JSX clean
    const updateField = (field: keyof HabitAnswers, value: number) => {
      onChange({ ...answers, [field]: value })
    }
  
    return (
      <section className="mx-auto max-w-2xl px-4 py-8">
        <Card className="overflow-hidden border-none shadow-xl">
          {/* Header Section */}
          <div className="bg-slate-50 border-b border-slate-100 p-6 mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Health Profile</h3>
            <p className="text-slate-500 text-sm mt-1">Please provide your medical metrics for an accurate analysis.</p>
            <div className="mt-6">
               <ProgressBar value={25} />
               <p className="text-right text-xs font-medium text-slate-400 mt-2">Step 1 of 4</p>
            </div>
          </div>
  
          <div className="p-6 pt-0 space-y-8">
            {/* Section 1: Basic Information */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-1 bg-indigo-500 rounded-full"></div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Basic Info</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FeatureInput
                  label="Age"
                  value={answers.Age}
                  onChange={(v) => updateField('Age', v)}
                  icon={UserRound}
                  iconClassName="text-slate-500"
                />
                <FeatureInput
                  label="Pregnancies"
                  value={answers.Pregnancies}
                  onChange={(v) => updateField('Pregnancies', v)}
                  icon={Baby}
                  iconClassName="text-pink-500"
                />
              </div>
            </section>
  
            {/* Section 2: Physical Metrics */}
            <section>
               <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-1 bg-emerald-500 rounded-full"></div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Body Composition</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FeatureInput
                  label="BMI"
                  value={answers.BMI}
                  onChange={(v) => updateField('BMI', v)}
                  step={0.1}
                  icon={Weight}
                  iconClassName="text-emerald-500"
                />
                <FeatureInput
                  label="Skin Thickness (mm)"
                  value={answers.SkinThickness}
                  onChange={(v) => updateField('SkinThickness', v)}
                  icon={Ruler}
                  iconClassName="text-cyan-500"
                />
              </div>
            </section>
  
            {/* Section 3: Clinical Vitals */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-1 bg-red-500 rounded-full"></div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Clinical Data</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FeatureInput
                  label="Glucose (mg/dL)"
                  value={answers.Glucose}
                  onChange={(v) => updateField('Glucose', v)}
                  icon={Droplet}
                  iconClassName="text-red-500"
                />
                <FeatureInput
                  label="Blood Pressure"
                  value={answers.BloodPressure}
                  onChange={(v) => updateField('BloodPressure', v)}
                  icon={Activity}
                  iconClassName="text-blue-500"
                />
                <FeatureInput
                  label="Insulin (mu U/ml)"
                  value={answers.Insulin}
                  onChange={(v) => updateField('Insulin', v)}
                  icon={TestTube}
                  iconClassName="text-violet-500"
                />
                <FeatureInput
                  label="Diabetes Pedigree"
                  value={answers.DiabetesPedigreeFunction}
                  onChange={(v) => updateField('DiabetesPedigreeFunction', v)}
                  step={0.01}
                  icon={Gauge}
                  iconClassName="text-indigo-500"
                />
              </div>
            </section>
  
            <div className="pt-4">
              <Button 
                variant="primary" 
                className="w-full py-4 text-lg shadow-lg shadow-indigo-100 transition-all hover:scale-[1.01]" 
                onClick={() => navigate('/analyze')}
              >
                Analyze Health Metrics
              </Button>
              <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                <Info size={12} /> Your data is processed locally and remains private.
              </p>
            </div>
          </div>
        </Card>
      </section>
    )
  }