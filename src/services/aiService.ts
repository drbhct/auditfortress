import type { PolicyTemplate, TemplateCategory } from '@/types'

// Mock AI service - in production, this would connect to OpenAI, Anthropic, or similar
export const aiService = {
  // Generate template content using AI
  async generateTemplateContent(prompt: string, category: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock AI responses based on category and prompt
    const responses = {
      privacy_policies: `
        <h1>Privacy Policy</h1>
        <h2>{{organization_name}}</h2>
        <p><strong>Effective Date:</strong> {{effective_date}}</p>
        
        <h3>1. Information We Collect</h3>
        <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>
        
        <h3>2. How We Use Your Information</h3>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send technical notices and support messages</li>
          <li>Respond to your comments and questions</li>
        </ul>
        
        <h3>3. Information Sharing</h3>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
        
        <h3>4. Data Security</h3>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        
        <h3>5. Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, please contact us at {{contact_email}}.</p>
      `,
      breach_procedures: `
        <h1>Data Breach Response Procedures</h1>
        <h2>{{organization_name}}</h2>
        <p><strong>Effective Date:</strong> {{effective_date}}</p>
        
        <h3>1. Incident Detection and Reporting</h3>
        <p>All personnel must immediately report any suspected data breach to the designated security officer at {{security_contact}}.</p>
        
        <h3>2. Initial Response Team</h3>
        <p>The following individuals will comprise the initial response team:</p>
        <ul>
          <li>Chief Information Security Officer</li>
          <li>Legal Counsel</li>
          <li>Public Relations Manager</li>
          <li>IT Director</li>
        </ul>
        
        <h3>3. Assessment and Containment</h3>
        <p>Within 24 hours of detection, the team will:</p>
        <ul>
          <li>Assess the scope and impact of the breach</li>
          <li>Implement containment measures</li>
          <li>Preserve evidence for investigation</li>
          <li>Document all actions taken</li>
        </ul>
        
        <h3>4. Notification Requirements</h3>
        <p>We will notify affected individuals within 72 hours of discovery, as required by applicable regulations.</p>
        
        <h3>5. Recovery and Prevention</h3>
        <p>Following containment, we will implement measures to prevent similar incidents and restore normal operations.</p>
      `,
      training_materials: `
        <h1>HIPAA Training Materials</h1>
        <h2>{{organization_name}} - {{training_year}}</h2>
        
        <h3>Learning Objectives</h3>
        <p>Upon completion of this training, participants will be able to:</p>
        <ul>
          <li>Identify protected health information (PHI)</li>
          <li>Understand HIPAA privacy and security rules</li>
          <li>Recognize potential security threats</li>
          <li>Implement appropriate safeguards</li>
        </ul>
        
        <h3>What is PHI?</h3>
        <p>Protected Health Information (PHI) includes any information that can identify an individual and relates to their health status, healthcare, or payment for healthcare services.</p>
        
        <h3>Privacy Rule Requirements</h3>
        <p>All staff must:</p>
        <ul>
          <li>Use PHI only for treatment, payment, and healthcare operations</li>
          <li>Disclose only the minimum necessary information</li>
          <li>Obtain patient authorization for other uses</li>
          <li>Maintain patient confidentiality</li>
        </ul>
        
        <h3>Security Safeguards</h3>
        <p>Implement appropriate administrative, physical, and technical safeguards to protect PHI.</p>
        
        <h3>Incident Reporting</h3>
        <p>Report any suspected breaches immediately to {{security_contact}}.</p>
      `,
      default: `
        <h1>{{template_title}}</h1>
        <h2>{{organization_name}}</h2>
        <p><strong>Effective Date:</strong> {{effective_date}}</p>
        
        <h3>1. Purpose</h3>
        <p>{{purpose_description}}</p>
        
        <h3>2. Scope</h3>
        <p>This policy applies to all {{organization_name}} employees, contractors, and third-party service providers.</p>
        
        <h3>3. Responsibilities</h3>
        <p>All personnel are responsible for compliance with this policy and must report violations to {{contact_email}}.</p>
        
        <h3>4. Implementation</h3>
        <p>This policy will be implemented immediately and reviewed annually.</p>
        
        <h3>5. Contact Information</h3>
        <p>For questions about this policy, contact {{contact_email}}.</p>
      `,
    }

    return responses[category as keyof typeof responses] || responses.default
  },

  // Enhance existing template content
  async enhanceTemplateContent(
    content: string,
    enhancementType: 'clarity' | 'completeness' | 'compliance'
  ): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock enhancements based on type
    const enhancements = {
      clarity: `
        <div class="enhancement-note" style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 1rem; margin: 1rem 0;">
          <h4>AI Enhancement: Improved Clarity</h4>
          <p>The following sections have been enhanced for better readability and understanding:</p>
          <ul>
            <li>Simplified technical language</li>
            <li>Added clear examples</li>
            <li>Improved sentence structure</li>
          </ul>
        </div>
      `,
      completeness: `
        <div class="enhancement-note" style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 1rem; margin: 1rem 0;">
          <h4>AI Enhancement: Added Missing Sections</h4>
          <p>The following sections have been added to ensure completeness:</p>
          <ul>
            <li>Definitions and terminology</li>
            <li>Implementation timeline</li>
            <li>Monitoring and review procedures</li>
            <li>Exception handling</li>
          </ul>
        </div>
      `,
      compliance: `
        <div class="enhancement-note" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 1rem; margin: 1rem 0;">
          <h4>AI Enhancement: Compliance Updates</h4>
          <p>The following compliance improvements have been made:</p>
          <ul>
            <li>Updated regulatory references</li>
            <li>Added required legal language</li>
            <li>Included mandatory disclosures</li>
            <li>Enhanced data protection measures</li>
          </ul>
        </div>
      `,
    }

    return content + enhancements[enhancementType]
  },

  // Generate questions for template review
  async generateReviewQuestions(template: PolicyTemplate): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const baseQuestions = [
      'Does this template cover all necessary legal requirements?',
      'Are the procedures clear and actionable?',
      'Is the language appropriate for the target audience?',
      'Are there any gaps in the content that need to be addressed?',
      'Does the template include proper contact information and escalation procedures?',
    ]

    const categoryQuestions = {
      privacy_policies: [
        'Does the policy clearly explain what information is collected?',
        'Are data retention periods specified?',
        'Is the process for data subject requests included?',
        'Are third-party data sharing practices disclosed?',
      ],
      breach_procedures: [
        'Are notification timelines clearly defined?',
        'Is the incident response team properly identified?',
        'Are escalation procedures clearly outlined?',
        'Is evidence preservation addressed?',
      ],
      training_materials: [
        'Are learning objectives clearly stated?',
        'Is the content appropriate for the target audience?',
        'Are assessment methods included?',
        'Is refresher training addressed?',
      ],
    }

    const specificQuestions =
      categoryQuestions[template.categoryId as keyof typeof categoryQuestions] || []
    return [...baseQuestions, ...specificQuestions]
  },

  // Suggest template improvements
  async suggestImprovements(template: PolicyTemplate): Promise<{
    suggestions: Array<{
      type: 'content' | 'structure' | 'compliance' | 'clarity'
      priority: 'high' | 'medium' | 'low'
      description: string
      example?: string
    }>
  }> {
    await new Promise(resolve => setTimeout(resolve, 1200))

    const suggestions = [
      {
        type: 'content' as const,
        priority: 'high' as const,
        description: 'Add a clear purpose statement at the beginning of the template',
        example: 'This policy establishes guidelines for...',
      },
      {
        type: 'structure' as const,
        priority: 'medium' as const,
        description: 'Consider adding a table of contents for longer templates',
        example: 'Use heading hierarchy (H1, H2, H3) consistently',
      },
      {
        type: 'compliance' as const,
        priority: 'high' as const,
        description: 'Include required legal disclaimers and regulatory references',
        example: 'Add "This policy complies with [REGULATION NAME]"',
      },
      {
        type: 'clarity' as const,
        priority: 'medium' as const,
        description: 'Simplify complex legal language for better understanding',
        example: 'Replace "utilize" with "use", "facilitate" with "help"',
      },
    ]

    return { suggestions }
  },

  // Generate template from description
  async generateTemplateFromDescription(
    description: string,
    category: string
  ): Promise<{
    name: string
    content: string
    variables: string[]
  }> {
    await new Promise(resolve => setTimeout(resolve, 2500))

    // Extract key information from description
    const name = `AI Generated: ${description.split(' ').slice(0, 5).join(' ')}`
    const content = await this.generateTemplateContent(description, category)

    // Extract variables from content
    const variableMatches = content.match(/\{\{([^}]+)\}\}/g)
    const variables = variableMatches
      ? [...new Set(variableMatches.map(match => match.replace(/\{\{|\}\}/g, '')))]
      : ['organization_name', 'effective_date', 'contact_email']

    return { name, content, variables }
  },
}
