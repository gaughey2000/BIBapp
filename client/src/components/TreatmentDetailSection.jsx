import { treatmentDetails, commonFAQ } from '../data/treatmentContent';

function TreatmentKeyInfo({ keyInfo }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-100">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">Key Information</h3>
      <ul className="space-y-2">
        {keyInfo.map((info, index) => (
          <li key={index} className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
            <svg className="w-4 h-4 text-[color:var(--rose)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {info}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TreatmentBenefits({ benefits }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-100">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">Benefits</h3>
      <ul className="space-y-2">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
            <svg className="w-4 h-4 text-[color:var(--rose)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TreatmentPlan({ treatmentPlan }) {
  return (
    <div className="bg-[color:var(--rose)]/5 rounded-xl p-4 sm:p-6 border border-[color:var(--rose)]/20">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">Treatment Plan</h3>
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-lg font-semibold text-[color:var(--rose)]">{treatmentPlan.sessions}</div>
          <div className="text-xs text-slate-600">Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-[color:var(--rose)]">{treatmentPlan.interval}</div>
          <div className="text-xs text-slate-600">Interval</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-[color:var(--rose)]">{treatmentPlan.maintenance}</div>
          <div className="text-xs text-slate-600">Maintenance</div>
        </div>
      </div>
    </div>
  );
}

function FAQSection() {
  const faqs = Object.values(commonFAQ);
  
  return (
    <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-100">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Frequently Asked Questions</h3>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index}>
            <h4 className="font-medium text-slate-900 mb-2">{faq.question}</h4>
            <p className="text-sm sm:text-base text-slate-700">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TreatmentDetailSection({ serviceName, serviceSlug }) {
  // Try to find matching treatment content
  const treatmentContent = Object.values(treatmentDetails).find(
    treatment => 
      treatment.name.toLowerCase() === serviceName?.toLowerCase() ||
      treatmentDetails[serviceSlug]
  ) || treatmentDetails[serviceSlug];

  if (!treatmentContent) {
    return null; // No authoritative content available
  }

  return (
    <div className="mt-6 sm:mt-8 space-y-6">
      {/* Overview */}
      <div className="prose max-w-none">
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-100">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">Overview</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {treatmentContent.overview}
          </p>
          {treatmentContent.additionalInfo && (
            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed">
              {treatmentContent.additionalInfo}
            </p>
          )}
        </div>
      </div>

      {/* Key Information */}
      {treatmentContent.keyInfo && <TreatmentKeyInfo keyInfo={treatmentContent.keyInfo} />}

      {/* Benefits */}
      {treatmentContent.benefits && <TreatmentBenefits benefits={treatmentContent.benefits} />}

      {/* Treatment Plan */}
      {treatmentContent.treatmentPlan && <TreatmentPlan treatmentPlan={treatmentContent.treatmentPlan} />}

      {/* Suitable For */}
      {treatmentContent.suitableFor && (
        <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-100">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">Suitable For</h3>
          <ul className="space-y-2">
            {treatmentContent.suitableFor.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                <svg className="w-4 h-4 text-[color:var(--rose)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Aftercare */}
      {treatmentContent.aftercare && (
        <div className="bg-amber-50 rounded-xl p-4 sm:p-6 border border-amber-200">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">Aftercare</h3>
          <p className="text-sm sm:text-base text-slate-700">{treatmentContent.aftercare}</p>
        </div>
      )}

      {/* Linked Concerns */}
      {treatmentContent.linkedConcerns && (
        <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-100">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">Addresses Concerns</h3>
          <div className="flex flex-wrap gap-2">
            {treatmentContent.linkedConcerns.map((concern, index) => (
              <span key={index} className="px-3 py-1.5 bg-[color:var(--rose)]/10 text-[color:var(--rose)] text-sm rounded-full">
                {concern}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}