import { useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import html2pdf from 'html2pdf.js'
import { Tab } from '@headlessui/react'
import ReactDOMServer from 'react-dom/server';

interface PlanDisplayProps {
  plan: string
  shortTermSteps: string[]
  longTermGoals: string[]
  onStartOver: () => void
}

export default function PlanDisplay({ plan, shortTermSteps, longTermGoals, onStartOver }: PlanDisplayProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('PlanDisplay mounted with:', { plan, shortTermSteps, longTermGoals });
  }, [plan, shortTermSteps, longTermGoals]);

  const extractSection = (title: string): string => {
    if (!plan) return '';
    
    // Match everything between this section and the next section starting with #
    const pattern = `${title}[\\s\\S]*?(?=\\n# |$)`;
    const regex = new RegExp(pattern);
    const match = plan.match(regex);
    
    if (match && match[0]) {
      const content = match[0].replace(title, '').trim();
      console.log(`Extracted section ${title}:`, content);
      return content;
    }
    console.log(`No match found for section ${title}`);
    return '';
  }

  const getShortTermSteps = (): string[] => {
    const section = extractSection('# Immediate Actions');
    const steps = section
      .split('\n')
      .filter(line => line.trim().match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim());
    console.log('Extracted short-term steps:', steps);
    return steps;
  }

  const renderPDFContent = () => {
    const analysis = extractSection('# Comprehensive Analysis');
    const steps = getShortTermSteps();
    const growth = extractSection('# Sustainable Growth Strategy');
    const support = extractSection('# Support System and Resources');
    const story = extractSection('# The Success Story');
    
    const timelineSections = [
      '# 1 Week Milestone',
      '# 1 Month Vision',
      '# 3 Month Transformation',
      '# 6 Month Evolution',
      '# 1 Year Achievement',
      '# 5 Year Vision'
    ].map(title => {
      const section = extractSection(title);
      const lines = section.split('\n');
      let actions: string[] = [];
      let outcome = '';

      let collectingActions = false;
      lines.forEach(line => {
        if (line.includes('Action Steps:')) {
          collectingActions = true;
        } else if (line.includes('Expected Outcome:')) {
          collectingActions = false;
          outcome = line.replace('Expected Outcome:', '').trim();
        } else if (collectingActions && line.trim().match(/^\d+\./)) {
          actions.push(line.replace(/^\d+\.\s*/, '').trim());
        }
      });

      return {
        title: title.replace('# ', ''),
        actions,
        outcome
      };
    });

    return (
      <div className="pdf-content text-black bg-white" style={{ width: '210mm', margin: '0 auto' }}>
        {/* Page 1: Analysis & Overview */}
        <div className="pdf-page h-[297mm] p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#FFA500] mb-2">Personal Development Roadmap</h1>
            <div className="w-32 h-1 bg-[#FFA500] mx-auto mb-8"></div>
            <h2 className="text-2xl font-bold text-[#FFA500]">Analysis & Overview</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h2 className="text-xl font-bold text-[#FFA500] mb-4">Comprehensive Analysis</h2>
              <div className="prose max-w-none">
                <ReactMarkdown>{analysis || 'No analysis available'}</ReactMarkdown>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#FFA500] mb-4">Immediate Actions</h2>
              {steps.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#FFA500] flex items-center justify-center flex-shrink-0 text-white">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </div>
              ) : (
                <p>No immediate actions available</p>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#FFA500] mb-4">Support System</h2>
              <div className="prose max-w-none">
                <ReactMarkdown>{support || 'No support system information available'}</ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="text-right text-sm text-gray-400 mt-4">Page 1/3</div>
        </div>

        {/* Page 2: Timeline */}
        <div className="pdf-page h-[297mm] p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#FFA500] mb-2">Development Timeline</h1>
            <div className="w-32 h-1 bg-[#FFA500] mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-8">
            {timelineSections.slice(0, 3).map(({ title, actions, outcome }) => (
              <div key={title} className="border border-gray-200 rounded-lg p-4">
                <h2 className="text-lg font-bold text-[#FFA500] mb-3">{title}</h2>
                <div>
                  <h3 className="text-base font-semibold mb-2">Action Steps:</h3>
                  {actions.length > 0 ? (
                    <ul className="list-none space-y-2 mb-4">
                      {actions.map((action, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#FFA500] flex items-center justify-center flex-shrink-0 text-white text-sm">
                            {index + 1}
                          </span>
                          <span className="text-sm">{action}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm mb-4">No action steps available</p>
                  )}
                  <div>
                    <h3 className="text-base font-semibold mb-2">Outcome:</h3>
                    <p className="text-sm text-gray-700">{outcome || 'No outcome specified'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            {timelineSections.slice(3).map(({ title, actions, outcome }) => (
              <div key={title} className="border border-gray-200 rounded-lg p-4">
                <h2 className="text-lg font-bold text-[#FFA500] mb-3">{title}</h2>
                <div>
                  <h3 className="text-base font-semibold mb-2">Action Steps:</h3>
                  {actions.length > 0 ? (
                    <ul className="list-none space-y-2 mb-4">
                      {actions.map((action, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#FFA500] flex items-center justify-center flex-shrink-0 text-white text-sm">
                            {index + 1}
                          </span>
                          <span className="text-sm">{action}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm mb-4">No action steps available</p>
                  )}
                  <div>
                    <h3 className="text-base font-semibold mb-2">Outcome:</h3>
                    <p className="text-sm text-gray-700">{outcome || 'No outcome specified'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right text-sm text-gray-400 mt-4">Page 2/3</div>
        </div>

        {/* Page 3: Success Story */}
        <div className="pdf-page h-[297mm] p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#FFA500] mb-2">Your Success Story</h1>
            <div className="w-32 h-1 bg-[#FFA500] mx-auto"></div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="prose max-w-none">
              <ReactMarkdown>{story || 'No success story available'}</ReactMarkdown>
            </div>
          </div>

          <div className="text-right text-sm text-gray-400 mt-4">Page 3/3</div>
        </div>
      </div>
    );
  };

  const renderOverview = () => {
    const analysis = extractSection('# Comprehensive Analysis');
    const steps = getShortTermSteps();
    const growth = extractSection('# Sustainable Growth Strategy');
    const support = extractSection('# Support System and Resources');

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-[#FFA500] mb-4">Analysis</h3>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{analysis || 'No analysis available'}</ReactMarkdown>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-[#FFA500] mb-4">Immediate Actions</h3>
          {steps.length > 0 ? (
            <ul className="list-none space-y-3">
              {steps.map((step, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-[#FFA500] flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-white">{step}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white">No immediate actions available</p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#FFA500] mb-4">Growth Strategy</h3>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{growth || 'No growth strategy available'}</ReactMarkdown>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#FFA500] mb-4">Support System</h3>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{support || 'No support system information available'}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  };

  const renderTimeline = () => {
    const timelineSections = [
      '# 1 Week Milestone',
      '# 1 Month Vision',
      '# 3 Month Transformation',
      '# 6 Month Evolution',
      '# 1 Year Achievement',
      '# 5 Year Vision'
    ].map(title => {
      const section = extractSection(title);
      const lines = section.split('\n');
      let actions: string[] = [];
      let outcome = '';

      // Find the action steps and outcome
      let collectingActions = false;
      lines.forEach(line => {
        if (line.includes('Action Steps:')) {
          collectingActions = true;
        } else if (line.includes('Expected Outcome:')) {
          collectingActions = false;
          outcome = line.replace('Expected Outcome:', '').trim();
        } else if (collectingActions && line.trim().match(/^\d+\./)) {
          actions.push(line.replace(/^\d+\.\s*/, '').trim());
        }
      });

      return {
        title: title.replace('# ', ''),
        actions,
        outcome
      };
    });

    return (
      <div className="space-y-8">
        {timelineSections.map(({ title, actions, outcome }) => (
          <div key={title} className="border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#FFA500] mb-4">{title}</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Action Steps:</h4>
                {actions.length > 0 ? (
                  <ul className="list-none space-y-2">
                    {actions.map((action, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <span className="w-6 h-6 rounded-full bg-[#FFA500] flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-white">{action}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white">No action steps available</p>
                )}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Expected Outcome:</h4>
                <p className="text-white/80">{outcome || 'No outcome specified'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSuccess = () => {
    const story = extractSection('# The Success Story');
    return (
      <div className="space-y-6">
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown>{story || 'No success story available'}</ReactMarkdown>
        </div>
      </div>
    );
  };

  const handleDownload = async () => {
    const pdfContainer = document.createElement('div');
    pdfContainer.style.width = '210mm';
    pdfContainer.style.margin = '0';
    pdfContainer.style.padding = '20mm';
    pdfContainer.style.background = 'white';
    pdfContainer.style.color = 'black';
    pdfContainer.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(pdfContainer);

    // Create content for PDF
    const content = document.createElement('div');
    content.innerHTML = `
      <style>
        .page {
          margin-bottom: 30mm;
          page-break-after: always;
        }
        .page:last-child {
          page-break-after: avoid;
        }
        h1 {
          font-size: 24px;
          color: #333;
          text-align: center;
          margin-bottom: 20px;
        }
        h2 {
          font-size: 20px;
          color: #666;
          border-bottom: 2px solid #FFA500;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .section {
          margin-bottom: 30px;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 8px;
        }
        .action-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 15px;
          padding: 10px;
          background: white;
          border-radius: 4px;
        }
        .number {
          width: 24px;
          height: 24px;
          background: #FFA500;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          flex-shrink: 0;
        }
        .timeline-item {
          margin-bottom: 20px;
          padding: 15px;
          background: white;
          border: 1px solid #eee;
          border-radius: 8px;
        }
        .page-number {
          text-align: right;
          color: #999;
          font-size: 12px;
          margin-top: 20px;
        }
      </style>

      <!-- Overview Page -->
      <div class="page">
        <h1>Personal Development Roadmap</h1>
        
        <div class="section">
          <h2>Analysis</h2>
          <div>${extractSection('# Comprehensive Analysis') || 'No analysis available'}</div>
        </div>

        <div class="section">
          <h2>Immediate Actions</h2>
          ${getShortTermSteps().length > 0 
            ? `<div>${getShortTermSteps().map((step, i) => `
                <div class="action-item">
                  <div class="number">${i + 1}</div>
                  <div>${step}</div>
                </div>
              `).join('')}</div>`
            : '<p>No immediate actions available</p>'
          }
        </div>

        <div class="section">
          <h2>Growth Strategy</h2>
          <div>${extractSection('# Sustainable Growth Strategy') || 'No growth strategy available'}</div>
        </div>

        <div class="section">
          <h2>Support System</h2>
          <div>${extractSection('# Support System and Resources') || 'No support system information available'}</div>
        </div>

        <div class="page-number">1/3</div>
      </div>

      <!-- Timeline Page -->
      <div class="page">
        <h1>Development Timeline</h1>
        
        ${[
          '# 1 Week Milestone',
          '# 1 Month Vision',
          '# 3 Month Transformation',
          '# 6 Month Evolution',
          '# 1 Year Achievement',
          '# 5 Year Vision'
        ].map(title => {
          const section = extractSection(title);
          const lines = section.split('\n');
          let actions: string[] = [];
          let outcome = '';

          let collectingActions = false;
          lines.forEach(line => {
            if (line.includes('Action Steps:')) {
              collectingActions = true;
            } else if (line.includes('Expected Outcome:')) {
              collectingActions = false;
              outcome = line.replace('Expected Outcome:', '').trim();
            } else if (collectingActions && line.trim().match(/^\d+\./)) {
              actions.push(line.replace(/^\d+\.\s*/, '').trim());
            }
          });

          return {
            title: title.replace('# ', ''),
            actions,
            outcome
          };
        }).map(({ title, actions, outcome }) => `
          <div class="timeline-item">
            <h2>${title}</h2>
            <div style="margin-bottom: 15px;">
              <strong>Action Steps:</strong>
              ${actions.length > 0 
                ? `<div style="margin-top: 10px;">
                    ${actions.map((action, i) => `
                      <div class="action-item">
                        <div class="number">${i + 1}</div>
                        <div>${action}</div>
                      </div>
                    `).join('')}
                  </div>`
                : '<p>No action steps available</p>'
              }
            </div>
            <div>
              <strong>Expected Outcome:</strong>
              <p style="margin-top: 5px;">${outcome || 'No outcome specified'}</p>
            </div>
          </div>
        `).join('')}

        <div class="page-number">2/3</div>
      </div>

      <!-- Success Story Page -->
      <div class="page">
        <h1>Your Success Story</h1>
        
        <div class="section">
          ${extractSection('# The Success Story') || 'No success story available'}
        </div>

        <div class="page-number">3/3</div>
      </div>
    `;

    pdfContainer.appendChild(content);

    const opt = {
      margin: 0,
      filename: 'personal-development-roadmap.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait'
      }
    };

    try {
      await html2pdf().set(opt).from(pdfContainer).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      document.body.removeChild(pdfContainer);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Your Personal Roadmap</h2>
        <div className="space-x-4">
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg bg-[#FFA500] text-black font-semibold hover:bg-[#FFA500]/90"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div ref={contentRef} className="rounded-xl bg-white/5 backdrop-blur-sm">
        <Tab.Group>
          <Tab.List className="flex space-x-2 rounded-t-xl bg-white/5 p-2">
            {['Overview', 'Timeline', 'Success Story'].map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                  ${selected
                    ? 'bg-[#FFA500] text-black shadow'
                    : 'text-white hover:bg-white/[0.12]'
                  } transition-all duration-200 focus:outline-none`
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="p-8">
            <Tab.Panel>{renderOverview()}</Tab.Panel>
            <Tab.Panel>{renderTimeline()}</Tab.Panel>
            <Tab.Panel>{renderSuccess()}</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onStartOver}
          className="px-6 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
