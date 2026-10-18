import React, { useState, useRef, useId } from 'react'
import { ArrowUpRight, Check, Mail, AlertCircle, MessageCircle } from 'lucide-react'

// Constant WhatsApp & Email recipients — fixed constants, never overridable by user input
const WHATSAPP_RECIPIENT_DIGITS = '917010571781'
const EMAIL_RECIPIENT = 'vasiharan030@gmail.com'

export interface InquiryFormData {
  name: string
  email: string
  projectType: string
  budget: string
  description: string
}

export const PROJECT_TYPE_OPTIONS = [
  'Business website or landing page',
  'Web application or dashboard',
  'ERP, admin portal or custom business software',
  'Real-time platform or collaboration tool',
  'AI search, retrieval or classification',
  'Other',
] as const

export const BUDGET_OPTIONS = [
  'Not decided yet',
  '< $500 (Small sprint / Landing page)',
  '$500 – $1,500 (MVP / Full-stack app)',
  '$1,500 – $3,500 (Custom platform / ERP)',
  '$3,500+ (Large-scale enterprise software)',
] as const

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function ProjectInquiryForm() {
  const formId = useId()
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    projectType: 'Business website or landing page',
    budget: 'Not decided yet',
    description: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof InquiryFormData, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof InquiryFormData, boolean>>>({})
  const [actionNotice, setActionNotice] = useState<{ type: 'whatsapp' | 'email'; message: string } | null>(null)

  const nameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const projectTypeSelectRef = useRef<HTMLSelectElement>(null)
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null)

  const validateField = (field: keyof InquiryFormData, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Please enter your full name.'
        if (value.trim().length < 2) return 'Name must be at least 2 characters.'
        return undefined
      case 'email':
        if (!value.trim()) return 'Please enter your email address.'
        if (!EMAIL_REGEX.test(value.trim())) return 'Please enter a valid email address (e.g. name@company.com).'
        return undefined
      case 'projectType':
        if (!value.trim()) return 'Please select a project type.'
        return undefined
      case 'description':
        if (!value.trim()) return 'Please describe what you want to build.'
        if (value.trim().length < 15) return 'Please provide a bit more detail (at least 15 characters).'
        return undefined
      default:
        return undefined
    }
  }

  const validateAll = (): boolean => {
    const newErrors: Partial<Record<keyof InquiryFormData, string>> = {}
    
    const nameErr = validateField('name', formData.name)
    if (nameErr) newErrors.name = nameErr

    const emailErr = validateField('email', formData.email)
    if (emailErr) newErrors.email = emailErr

    const typeErr = validateField('projectType', formData.projectType)
    if (typeErr) newErrors.projectType = typeErr

    const descErr = validateField('description', formData.description)
    if (descErr) newErrors.description = descErr

    setErrors(newErrors)
    setTouched({
      name: true,
      email: true,
      projectType: true,
      budget: true,
      description: true,
    })

    if (Object.keys(newErrors).length > 0) {
      // Focus the first invalid element
      if (newErrors.name) {
        nameInputRef.current?.focus()
      } else if (newErrors.email) {
        emailInputRef.current?.focus()
      } else if (newErrors.projectType) {
        projectTypeSelectRef.current?.focus()
      } else if (newErrors.description) {
        descriptionTextareaRef.current?.focus()
      }
      return false
    }

    return true
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    const fieldName = name as keyof InquiryFormData
    
    setFormData(prev => ({ ...prev, [fieldName]: value }))
    
    // Clear error dynamically if already touched
    if (touched[fieldName]) {
      const err = validateField(fieldName, value)
      setErrors(prev => ({ ...prev, [fieldName]: err }))
    }
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    const fieldName = name as keyof InquiryFormData
    setTouched(prev => ({ ...prev, [fieldName]: true }))
    const err = validateField(fieldName, value)
    setErrors(prev => ({ ...prev, [fieldName]: err }))
  }

  const constructFormattedMessage = (): string => {
    const budgetText = formData.budget && formData.budget.trim() ? formData.budget.trim() : 'Not decided yet'
    return [
      `Hello Vasiharan,`,
      `I'd like to discuss a project with you.`,
      ``,
      `Name: ${formData.name.trim()}`,
      `Email: ${formData.email.trim()}`,
      `Project type: ${formData.projectType.trim()}`,
      `Budget: ${budgetText}`,
      ``,
      `Project description:`,
      formData.description.trim(),
      ``,
      `I look forward to discussing the next steps.`,
    ].join('\n')
  }

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateAll()) return

    const message = constructFormattedMessage()
    const encodedText = encodeURIComponent(message)
    const targetUrl = `https://wa.me/${WHATSAPP_RECIPIENT_DIGITS}?text=${encodedText}`

    setActionNotice({
      type: 'whatsapp',
      message: 'Opening WhatsApp with your pre-filled inquiry. You can review the details before hitting send.',
    })

    // Open WhatsApp click-to-chat in a new tab
    window.open(targetUrl, '_blank', 'noopener,noreferrer')
  }

  const handleEmailSubmit = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!validateAll()) return

    const subject = `Project Inquiry — ${formData.projectType.trim()}`
    const body = constructFormattedMessage()
    const mailtoUrl = `mailto:${EMAIL_RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    setActionNotice({
      type: 'email',
      message: 'Opening your default mail client with a prepared draft. Review and send whenever ready.',
    })

    // Open user's default email handler
    window.location.href = mailtoUrl
  }

  return (
    <div className="inquiry-card">
      <div className="inquiry-card-glow" aria-hidden="true" />
      <div className="inquiry-card-header">
        <div className="inquiry-header-tag">
          <span className="inquiry-tag-dot" />
          <span>STRUCTURED PROJECT INQUIRY</span>
        </div>
        <p className="inquiry-header-subtitle">
          Direct communication via WhatsApp or email. Response typically within 24 hours.
        </p>
      </div>

      <form
        className="inquiry-form"
        onSubmit={handleWhatsAppSubmit}
        noValidate
        aria-label="Project inquiry form"
      >
        {/* Row 1: Name and Email */}
        <div className="inquiry-row inquiry-row-two">
          <div className={`inquiry-field-group ${errors.name && touched.name ? 'has-error' : ''}`}>
            <label htmlFor={`${formId}-name`} className="inquiry-label">
              <span>Your Name</span>
              <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <input
              ref={nameInputRef}
              id={`${formId}-name`}
              name="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Alexander Vance"
              className="inquiry-input"
              aria-required="true"
              aria-invalid={errors.name && touched.name ? 'true' : 'false'}
              aria-describedby={errors.name && touched.name ? `${formId}-name-error` : undefined}
            />
            {errors.name && touched.name && (
              <span id={`${formId}-name-error`} className="inquiry-inline-error" role="alert">
                <AlertCircle size={12} /> {errors.name}
              </span>
            )}
          </div>

          <div className={`inquiry-field-group ${errors.email && touched.email ? 'has-error' : ''}`}>
            <label htmlFor={`${formId}-email`} className="inquiry-label">
              <span>Email Address</span>
              <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <input
              ref={emailInputRef}
              id={`${formId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. alexander@enterprise.com"
              className="inquiry-input"
              aria-required="true"
              aria-invalid={errors.email && touched.email ? 'true' : 'false'}
              aria-describedby={errors.email && touched.email ? `${formId}-email-error` : undefined}
            />
            {errors.email && touched.email && (
              <span id={`${formId}-email-error`} className="inquiry-inline-error" role="alert">
                <AlertCircle size={12} /> {errors.email}
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Project Type & Budget Range */}
        <div className="inquiry-row inquiry-row-two">
          <div className={`inquiry-field-group ${errors.projectType && touched.projectType ? 'has-error' : ''}`}>
            <label htmlFor={`${formId}-project-type`} className="inquiry-label">
              <span>Project Type</span>
              <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <div className="inquiry-select-wrapper">
              <select
                ref={projectTypeSelectRef}
                id={`${formId}-project-type`}
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                onBlur={handleBlur}
                className="inquiry-select"
                aria-required="true"
                aria-invalid={errors.projectType && touched.projectType ? 'true' : 'false'}
                aria-describedby={errors.projectType && touched.projectType ? `${formId}-type-error` : undefined}
              >
                {PROJECT_TYPE_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            {errors.projectType && touched.projectType && (
              <span id={`${formId}-type-error`} className="inquiry-inline-error" role="alert">
                <AlertCircle size={12} /> {errors.projectType}
              </span>
            )}
          </div>

          <div className="inquiry-field-group">
            <label htmlFor={`${formId}-budget`} className="inquiry-label">
              <span>Budget Range</span>
              <span className="optional-mark">(Optional)</span>
            </label>
            <div className="inquiry-select-wrapper">
              <select
                id={`${formId}-budget`}
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="inquiry-select"
              >
                {BUDGET_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Row 3: Project Description */}
        <div className={`inquiry-field-group ${errors.description && touched.description ? 'has-error' : ''}`}>
          <div className="inquiry-label-row">
            <label htmlFor={`${formId}-description`} className="inquiry-label">
              <span>Project Description</span>
              <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <span className="inquiry-char-count">
              {formData.description.length} / 2000
            </span>
          </div>
          <textarea
            ref={descriptionTextareaRef}
            id={`${formId}-description`}
            name="description"
            rows={4}
            maxLength={2000}
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Tell me about what you want to build, timeline goals, key features, or any existing tech stack..."
            className="inquiry-textarea"
            aria-required="true"
            aria-invalid={errors.description && touched.description ? 'true' : 'false'}
            aria-describedby={errors.description && touched.description ? `${formId}-desc-error` : undefined}
          />
          {errors.description && touched.description && (
            <span id={`${formId}-desc-error`} className="inquiry-inline-error" role="alert">
              <AlertCircle size={12} /> {errors.description}
            </span>
          )}
        </div>

        {/* Action Notice when initiated */}
        {actionNotice && (
          <div className="inquiry-action-notice" role="status">
            <Check size={14} className="notice-icon" />
            <span>{actionNotice.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="inquiry-actions-row">
          <button
            type="submit"
            className="button button-primary inquiry-submit-btn inquiry-whatsapp-btn"
            id="inquiry-submit-whatsapp"
          >
            {/* Standard WhatsApp vector icon */}
            <svg
              className="whatsapp-icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.05 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span>Send inquiry via WhatsApp</span>
            <ArrowUpRight size={16} />
          </button>

          <button
            type="button"
            onClick={handleEmailSubmit}
            className="button button-quiet inquiry-email-btn"
            id="inquiry-submit-email"
            title="Open draft in your email client"
          >
            <Mail size={16} />
            <span>Send via email</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Small reassuring note */}
        <p className="inquiry-helper-note">
          WhatsApp click-to-chat prepares the message with your details. You can review and edit before sending.
        </p>
      </form>
    </div>
  )
}
