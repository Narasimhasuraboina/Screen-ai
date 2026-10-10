import {
  SummarizeRequest,
  SummarizeResponse,
  ChatRequest,
  ChatResponse,
} from '@screenai/shared';
import { AiProviderAdapter } from './types';

export class MockAiProvider implements AiProviderAdapter {
  readonly name = 'mock';
  readonly model = 'screenai-heuristic-v1';
  readonly isConfigured = true;

  async summarize(request: SummarizeRequest): Promise<SummarizeResponse> {
    const { page, mode, customPrompt } = request;
    const { title, mainText, headings, category, domain, codeSnippets } = page;

    // Extract prominent sentences and headings
    const sentences = mainText
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20);

    const firstFewSentences = sentences.slice(0, 3).join(' ');
    const midSentences = sentences.slice(3, 6).join(' ');
    const headingList = headings.slice(0, 5).map((h) => h.text);

    const mainTopic = title.replace(/\s*[-|–].*$/, '').trim() || 'the subject of this page';

    const keyTakeaways = [
      `Primary Focus: ${mainTopic} on ${domain}.`,
      headingList.length > 0
        ? `Covers key areas including ${headingList.slice(0, 3).join(', ')}.`
        : `Discusses core arguments and details across ${page.wordCount} words.`,
      category === 'documentation'
        ? `Provides technical specifications, API structures, and ${codeSnippets.length} relevant code examples.`
        : category === 'github'
        ? `Outlines open-source project architecture, repository dependencies, and execution setup.`
        : category === 'news'
        ? `Reports on recent developments with context and statements from involved parties.`
        : `Synthesizes practical insights with direct takeaways for readers.`,
      `Extracted directly from the visible content on ${domain} without external speculation.`,
    ];

    const whyItMatters =
      category === 'documentation'
        ? `Accurate understanding of these technical specifications prevents implementation errors and accelerates development.`
        : category === 'github'
        ? `Understanding the repository layout and setup guides helps developers evaluate or contribute effectively.`
        : category === 'news'
        ? `Provides timely context on ongoing industry shifts and implications for stakeholders.`
        : `Offers valuable perspective on ${mainTopic}, allowing quick comprehension without wading through extraneous page clutter.`;

    const whatToExploreNext =
      category === 'documentation'
        ? `Review associated API endpoints, inspect the code samples, and verify version compatibility.`
        : category === 'github'
        ? `Clone the repository, check the open issues/pull requests, and run the test suite locally.`
        : `Check the primary references listed on ${domain} and explore related topics noted in the article.`;

    if (mode === 'quick') {
      const summaryText =
        firstFewSentences ||
        `This page discusses ${mainTopic} on ${domain}. It outlines the primary considerations, background context, and practical implications across the text. Readers gain an actionable summary of the main points without unnecessary filler.`;

      return {
        summary: summaryText,
        mode: 'quick',
        mainTopic,
        keyTakeaways: keyTakeaways.slice(0, 3),
        confidenceNote: 'Generated via ScreenAI Intelligent Offline Engine. Set AI_API_KEY in .env for external LLM models.',
        references: headingList.slice(0, 2),
      };
    }

    if (mode === 'takeaways') {
      return {
        summary: `Key takeaways and core points distilled from "${title}":`,
        mode: 'takeaways',
        mainTopic,
        keyTakeaways,
        whyItMatters,
        whatToExploreNext,
        confidenceNote: 'Generated via ScreenAI Intelligent Offline Engine. Set AI_API_KEY in .env for external LLM models.',
        references: headingList.slice(0, 3),
      };
    }

    // Detailed mode
    const keySections = [
      {
        title: 'Introduction & Core Subject',
        content: firstFewSentences || `The document introduces ${mainTopic} and establishes the foundational background.`,
      },
      {
        title: 'Key Concepts & Breakdown',
        content:
          midSentences ||
          `The page details relevant aspects including ${headingList.join('; ') || 'methodology, key arguments, and observations'}.`,
      },
      {
        title: 'Conclusions & Takeaways',
        content: `The author summarizes the essential findings and recommendations for practitioners and readers navigating ${mainTopic}.`,
      },
    ];

    if (codeSnippets.length > 0) {
      keySections.push({
        title: 'Code & Technical Artifacts',
        content: `The document includes ${codeSnippets.length} code snippet(s). Language detected: ${codeSnippets[0].language || 'Code snippet'}.`,
      });
    }

    return {
      summary: `### Detailed Overview of "${title}"\n\n${firstFewSentences}\n\n${midSentences}`,
      mode: 'detailed',
      mainTopic,
      keyTakeaways,
      whyItMatters,
      whatToExploreNext,
      keySections,
      references: headingList,
      confidenceNote: 'Generated via ScreenAI Intelligent Offline Engine. Set AI_API_KEY in .env for external LLM models.',
    };
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const { page, question } = request;
    const lowerQuestion = question.toLowerCase();

    // Check if question asks for beginner explanation
    if (lowerQuestion.includes('beginner') || lowerQuestion.includes('explain like i\'m 5') || lowerQuestion.includes('eli5')) {
      return {
        reply: `### Simple Explanation of "${page.title}"\n\nImagine you are explaining this to a newcomer: **${page.title}** is essentially about helping you understand ${page.domain}'s core message without getting lost in technical jargon.\n\n- **The main idea:** It focuses on ${page.headings[0]?.text || 'the primary subject'} in an approachable way.\n- **Why people care:** It solves real problems by making things clearer and easier to follow.\n- **Bottom line:** You get the main benefits without needing years of background knowledge.`,
        isPageGrounded: true,
        references: page.headings.slice(0, 2).map((h) => h.text),
      };
    }

    // Check if asking about code
    if (lowerQuestion.includes('code') || lowerQuestion.includes('snippet') || lowerQuestion.includes('programming')) {
      if (page.codeSnippets.length > 0) {
        const snippet = page.codeSnippets[0];
        return {
          reply: `### Code Analysis\n\nThe page contains ${page.codeSnippets.length} code example(s). Here is an analysis of the extracted snippet:\n\n\`\`\`${snippet.language || 'text'}\n${snippet.code.slice(0, 300)}${snippet.code.length > 300 ? '...' : ''}\n\`\`\`\n\n**Explanation:** This snippet illustrates the implementation pattern discussed in the text, ensuring syntax and call structures align with the documented API.`,
          isPageGrounded: true,
          references: ['Extracted code block'],
        };
      } else {
        return {
          reply: `I inspected the extracted content from **${page.title}**, but no explicit code blocks were detected in the visible article body. The page appears to be primarily text-based.`,
          isPageGrounded: true,
        };
      }
    }

    // Check if asking for prerequisites
    if (lowerQuestion.includes('prerequisite') || lowerQuestion.includes('requirement')) {
      return {
        reply: `### Prerequisites & Requirements\n\nBased on the extracted text from **${page.domain}**:\n\n1. Familiarity with the general topic: *${page.title}*.\n2. Access to standard tools mentioned in the documentation or article.\n\n*Note:* If specific version requirements are not explicitly listed in the main article body, refer to the project's documentation repository.`,
        isPageGrounded: true,
      };
    }

    // General search within the text
    const words = question
      .split(/\s+/)
      .map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ''))
      .filter((w) => w.length > 3 && !['what', 'when', 'where', 'which', 'about', 'this', 'that', 'page', 'tell'].includes(w));

    const matchedSentences = page.mainText
      .split(/(?<=[.?!])\s+/)
      .filter((s) => {
        const lower = s.toLowerCase();
        return words.some((w) => lower.includes(w));
      })
      .slice(0, 3);

    if (matchedSentences.length > 0) {
      return {
        reply: `Based on **${page.title}** on ${page.domain}:\n\n${matchedSentences.join(' ')}\n\n*Grounding note:* This information was extracted directly from the visible text of the active page.`,
        isPageGrounded: true,
        references: page.headings.slice(0, 2).map((h) => h.text),
      };
    }

    return {
      reply: `Regarding your question: "${question}"\n\nThe extracted webpage content from **${page.title}** does not contain explicit details directly answering this query. \n\nGeneral context: The page primarily focuses on **${page.headings[0]?.text || page.title}**. If you'd like general background knowledge beyond what this webpage states, feel free to ask!`,
      isPageGrounded: false,
    };
  }
}

