// Text to Presentation Generator - Main Application Logic

class PresentationGenerator {
    constructor() {
        this.currentFile = null;
        this.currentSlides = [];
        this.templateColors = ['#1f4e79', '#70ad47', '#ffc000', '#c5504b'];
        this.templateFont = 'Calibri';
        this.processingSteps = [
            'Validating inputs',
            'Analyzing template structure',
            'Processing text with AI',
            'Generating slide structure',
            'Applying template styling',
            'Creating PowerPoint file',
            'Preparing download'
        ];
        
        this.sampleText = `# Introduction to Artificial Intelligence

Artificial Intelligence (AI) represents one of the most transformative technologies of our time. This presentation will explore the fundamental concepts, applications, and future implications of AI.

## What is AI?

AI refers to computer systems that can perform tasks typically requiring human intelligence. These include learning, reasoning, perception, and decision-making.

## Key Applications

- Healthcare: Diagnostic assistance and drug discovery
- Transportation: Autonomous vehicles and traffic optimization  
- Finance: Fraud detection and algorithmic trading
- Education: Personalized learning and intelligent tutoring

## Benefits and Challenges

### Benefits
- Increased efficiency and productivity
- Enhanced decision-making capabilities
- Automation of repetitive tasks
- Innovation in research and development

### Challenges
- Ethical considerations and bias
- Job displacement concerns
- Privacy and security issues
- Need for regulatory frameworks

## Future Outlook

AI will continue to evolve and integrate into various aspects of society. The key to success lies in responsible development and deployment.

## Conclusion

As we advance into an AI-driven future, it's crucial to balance innovation with ethical considerations and human values.`;

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupFormValidation();
        this.updateCharCount();
    }

    bindEvents() {
        // Text input events
        document.getElementById('textContent').addEventListener('input', () => this.updateCharCount());
        document.getElementById('loadSample').addEventListener('click', () => this.loadSampleText());

        // Guidance examples
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.getElementById('guidance').value = e.target.dataset.example;
            });
        });

        // Provider selection
        document.getElementById('provider').addEventListener('change', () => this.updateApiKeyFormat());

        // File upload events
        this.setupFileUpload();

        // Generation button - removed disabled check to allow error messages
        document.getElementById('generateBtn').addEventListener('click', () => this.generatePresentation());

        // Download button
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadPresentation());

        // Modal events
        document.getElementById('closeError').addEventListener('click', () => this.hideError());
        document.getElementById('closeErrorBtn').addEventListener('click', () => this.hideError());

        // Generate another
        document.getElementById('generateAnother').addEventListener('click', () => this.resetForm());

        // Form validation
        this.setupRealTimeValidation();
    }

    updateCharCount() {
        const textContent = document.getElementById('textContent').value;
        const charCount = document.querySelector('.char-count');
        charCount.textContent = `${textContent.length.toLocaleString()} characters`;
        this.validateForm();
    }

    loadSampleText() {
        document.getElementById('textContent').value = this.sampleText;
        this.updateCharCount();
    }

    updateApiKeyFormat() {
        const provider = document.getElementById('provider').value;
        const formatElement = document.getElementById('apiKeyFormat');
        
        const formats = {
            openai: 'Format: sk-... (starts with sk-)',
            anthropic: 'Format: sk-ant-... (starts with sk-ant-)',
            gemini: 'Format: AIza... (starts with AIza)'
        };
        
        formatElement.textContent = formats[provider] || 'Your API key will be used only for this session';
        this.validateForm();
    }

    setupFileUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('templateFile');
        const uploadedFile = document.getElementById('uploadedFile');
        const removeBtn = document.getElementById('removeFile');

        // Click to upload
        uploadArea.addEventListener('click', () => fileInput.click());

        // File input change
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) this.handleFileUpload(file);
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file) this.handleFileUpload(file);
        });

        // Remove file
        removeBtn.addEventListener('click', () => this.removeFile());
    }

    handleFileUpload(file) {
        // Validate file type
        const validTypes = ['.pptx', '.potx'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validTypes.includes(fileExtension)) {
            this.showError('Please upload a valid PowerPoint file (.pptx or .potx)');
            return;
        }

        // Validate file size (50MB limit)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            this.showError('File size must be less than 50MB');
            return;
        }

        this.currentFile = file;
        this.displayUploadedFile(file);
        this.analyzeTemplate(file);
        this.validateForm();
    }

    displayUploadedFile(file) {
        const uploadArea = document.getElementById('uploadArea');
        const uploadedFile = document.getElementById('uploadedFile');
        const fileName = uploadedFile.querySelector('.file-name');
        const fileSize = uploadedFile.querySelector('.file-size');

        uploadArea.style.display = 'none';
        uploadedFile.style.display = 'block';

        fileName.textContent = file.name;
        fileSize.textContent = this.formatFileSize(file.size);
    }

    removeFile() {
        this.currentFile = null;
        document.getElementById('uploadArea').style.display = 'block';
        document.getElementById('uploadedFile').style.display = 'none';
        document.getElementById('templateAnalysis').style.display = 'none';
        document.getElementById('templateFile').value = '';
        this.validateForm();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    analyzeTemplate(file) {
        // Simulate template analysis
        setTimeout(() => {
            const analysisDiv = document.getElementById('templateAnalysis');
            const colorPalette = document.getElementById('colorPalette');
            const primaryFont = document.getElementById('primaryFont');
            const layoutsFound = document.getElementById('layoutsFound');

            // Simulate extracted colors
            colorPalette.innerHTML = '';
            this.templateColors.forEach(color => {
                const swatch = document.createElement('div');
                swatch.className = 'color-swatch';
                swatch.style.backgroundColor = color;
                swatch.title = color;
                colorPalette.appendChild(swatch);
            });

            primaryFont.textContent = this.templateFont;
            layoutsFound.textContent = '5 layouts';

            analysisDiv.style.display = 'block';
        }, 1000);
    }

    setupRealTimeValidation() {
        const inputs = ['textContent', 'provider', 'apiKey'];
        inputs.forEach(id => {
            document.getElementById(id).addEventListener('input', () => this.validateForm());
            document.getElementById(id).addEventListener('change', () => this.validateForm());
        });
    }

    validateForm() {
        const textContent = document.getElementById('textContent').value.trim();
        const provider = document.getElementById('provider').value;
        const apiKey = document.getElementById('apiKey').value.trim();
        const hasFile = this.currentFile !== null;

        const isValid = textContent.length > 0 && provider && apiKey.length > 0 && hasFile;

        // Update button appearance but don't disable it completely
        const generateBtn = document.getElementById('generateBtn');
        if (isValid) {
            generateBtn.classList.remove('btn--outline');
            generateBtn.classList.add('btn--primary');
        } else {
            generateBtn.classList.remove('btn--primary');
            generateBtn.classList.add('btn--outline');
        }

        return isValid;
    }

    setupFormValidation() {
        this.validateForm();
    }

    async generatePresentation() {
        // Check validation and show specific error messages
        const validation = this.getValidationErrors();
        if (validation.length > 0) {
            this.showError(validation.join('\n'));
            return;
        }

        try {
            this.showProgress();
            await this.processGeneration();
            this.showResults();
        } catch (error) {
            console.error('Generation error:', error);
            this.showError(error.message || 'An error occurred while generating the presentation');
            this.hideProgress();
        }
    }

    getValidationErrors() {
        const errors = [];
        const textContent = document.getElementById('textContent').value.trim();
        const provider = document.getElementById('provider').value;
        const apiKey = document.getElementById('apiKey').value.trim();
        const hasFile = this.currentFile !== null;

        if (textContent.length === 0) {
            errors.push('• Please enter your text content');
        }
        if (!provider) {
            errors.push('• Please select an AI provider');
        }
        if (apiKey.length === 0) {
            errors.push('• Please enter your API key');
        }
        if (!hasFile) {
            errors.push('• Please upload a PowerPoint template file');
        }

        return errors;
    }

    showProgress() {
        document.getElementById('progressSection').style.display = 'block';
        document.getElementById('resultsSection').style.display = 'none';
        const generateBtn = document.getElementById('generateBtn');
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
    }

    hideProgress() {
        document.getElementById('progressSection').style.display = 'none';
        const generateBtn = document.getElementById('generateBtn');
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Presentation';
    }

    async processGeneration() {
        const progressFill = document.getElementById('progressFill');
        const steps = document.querySelectorAll('.progress-step');

        for (let i = 0; i < this.processingSteps.length; i++) {
            // Update progress bar
            const progress = ((i + 1) / this.processingSteps.length) * 100;
            progressFill.style.width = `${progress}%`;

            // Update step indicators
            steps.forEach((step, index) => {
                step.classList.remove('active', 'completed');
                if (index < i) {
                    step.classList.add('completed');
                } else if (index === i) {
                    step.classList.add('active');
                }
            });

            // Simulate processing time
            await this.sleep(800 + Math.random() * 400);

            // Process each step
            switch (i) {
                case 0: // Validating inputs
                    this.validateInputs();
                    break;
                case 1: // Analyzing template
                    await this.analyzeTemplateStructure();
                    break;
                case 2: // Processing with AI
                    await this.processTextWithAI();
                    break;
                case 3: // Generating slide structure
                    this.generateSlideStructure();
                    break;
                case 4: // Applying template styling
                    this.applyTemplateStyles();
                    break;
                case 5: // Creating PowerPoint
                    await this.createPowerPoint();
                    break;
                case 6: // Preparing download
                    this.prepareDownload();
                    break;
            }
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    validateInputs() {
        const textContent = document.getElementById('textContent').value;
        const apiKey = document.getElementById('apiKey').value;
        
        if (textContent.length < 50) {
            throw new Error('Text content is too short. Please provide at least 50 characters.');
        }
        
        if (apiKey.length < 10) {
            throw new Error('Invalid API key format.');
        }
    }

    async analyzeTemplateStructure() {
        // Simulate template analysis
        this.templateStructure = {
            colors: this.templateColors,
            font: this.templateFont,
            layouts: ['Title Slide', 'Title and Content', 'Section Header', 'Two Content', 'Comparison']
        };
    }

    async processTextWithAI() {
        const textContent = document.getElementById('textContent').value;
        const guidance = document.getElementById('guidance').value;
        
        // Simulate AI processing
        this.aiProcessedContent = this.parseTextToSlides(textContent, guidance);
    }

    parseTextToSlides(text, guidance) {
        const lines = text.split('\n').filter(line => line.trim());
        const slides = [];
        let currentSlide = null;

        for (const line of lines) {
            const trimmedLine = line.trim();
            
            if (trimmedLine.startsWith('# ')) {
                // Main title
                if (currentSlide) slides.push(currentSlide);
                currentSlide = {
                    type: 'title',
                    title: trimmedLine.substring(2),
                    content: []
                };
            } else if (trimmedLine.startsWith('## ')) {
                // Section header
                if (currentSlide) slides.push(currentSlide);
                currentSlide = {
                    type: 'section',
                    title: trimmedLine.substring(3),
                    content: []
                };
            } else if (trimmedLine.startsWith('### ')) {
                // Subsection
                if (currentSlide) slides.push(currentSlide);
                currentSlide = {
                    type: 'content',
                    title: trimmedLine.substring(4),
                    content: []
                };
            } else if (trimmedLine.startsWith('- ')) {
                // Bullet point
                if (currentSlide) {
                    currentSlide.content.push(trimmedLine.substring(2));
                }
            } else if (trimmedLine.length > 0) {
                // Regular content
                if (currentSlide) {
                    currentSlide.content.push(trimmedLine);
                }
            }
        }
        
        if (currentSlide) slides.push(currentSlide);

        // If no structured content, create slides from paragraphs
        if (slides.length === 0) {
            const paragraphs = text.split('\n\n').filter(p => p.trim());
            slides.push({
                type: 'title',
                title: 'Presentation',
                content: []
            });
            
            paragraphs.forEach((paragraph, index) => {
                if (index === 0) return; // Skip first paragraph if used as title
                slides.push({
                    type: 'content',
                    title: `Slide ${index + 1}`,
                    content: [paragraph.trim()]
                });
            });
        }

        return slides;
    }

    generateSlideStructure() {
        this.currentSlides = this.aiProcessedContent.map((slide, index) => ({
            ...slide,
            slideNumber: index + 1
        }));
    }

    applyTemplateStyles() {
        // Apply template colors and fonts to slides
        this.styledSlides = this.currentSlides.map(slide => ({
            ...slide,
            backgroundColor: this.templateColors[0],
            titleColor: this.templateColors[1],
            textColor: '#333333',
            font: this.templateFont
        }));
    }

    async createPowerPoint() {
        const pptx = new PptxGenJS();
        
        // Set presentation properties
        pptx.author = 'Text to Presentation Generator';
        pptx.company = 'Auto-Generated';
        pptx.title = 'Generated Presentation';
        
        // Create slides
        this.styledSlides.forEach((slideData, index) => {
            const slide = pptx.addSlide();
            
            if (slideData.type === 'title') {
                // Title slide
                slide.addText(slideData.title, {
                    x: 1,
                    y: 2.5,
                    w: 8,
                    h: 2,
                    fontSize: 36,
                    bold: true,
                    color: slideData.titleColor,
                    fontFace: slideData.font,
                    align: 'center'
                });
                
                if (slideData.content.length > 0) {
                    slide.addText(slideData.content.join(' '), {
                        x: 1,
                        y: 4.5,
                        w: 8,
                        h: 1,
                        fontSize: 18,
                        color: slideData.textColor,
                        fontFace: slideData.font,
                        align: 'center'
                    });
                }
            } else if (slideData.type === 'section') {
                // Section header slide
                slide.addText(slideData.title, {
                    x: 1,
                    y: 3,
                    w: 8,
                    h: 1.5,
                    fontSize: 32,
                    bold: true,
                    color: slideData.titleColor,
                    fontFace: slideData.font,
                    align: 'center'
                });
            } else {
                // Content slide
                slide.addText(slideData.title, {
                    x: 0.5,
                    y: 0.5,
                    w: 9,
                    h: 1,
                    fontSize: 24,
                    bold: true,
                    color: slideData.titleColor,
                    fontFace: slideData.font
                });
                
                if (slideData.content.length > 0) {
                    const contentText = slideData.content.map(item => 
                        item.startsWith('-') ? `• ${item.substring(1).trim()}` : item
                    ).join('\n');
                    
                    slide.addText(contentText, {
                        x: 0.5,
                        y: 1.5,
                        w: 9,
                        h: 5,
                        fontSize: 16,
                        color: slideData.textColor,
                        fontFace: slideData.font,
                        valign: 'top'
                    });
                }
            }
            
            // Add slide background
            slide.background = { color: slideData.backgroundColor };
        });
        
        this.generatedPresentation = pptx;
    }

    prepareDownload() {
        // Preparation complete
        this.downloadReady = true;
    }

    showResults() {
        document.getElementById('progressSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        document.getElementById('slideCount').textContent = this.currentSlides.length;
        
        // Reset generate button
        const generateBtn = document.getElementById('generateBtn');
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Presentation';
        
        // Display slides preview
        this.displaySlidesPreview();
    }

    displaySlidesPreview() {
        const slidesList = document.getElementById('slidesList');
        slidesList.innerHTML = '';
        
        this.currentSlides.forEach((slide, index) => {
            const slideItem = document.createElement('div');
            slideItem.className = 'slide-item';
            
            slideItem.innerHTML = `
                <div class="slide-number">${index + 1}</div>
                <div class="slide-content">
                    <h5>${slide.title}</h5>
                    <p>${slide.content.slice(0, 2).join(' ').substring(0, 100)}${slide.content.join(' ').length > 100 ? '...' : ''}</p>
                </div>
            `;
            
            slidesList.appendChild(slideItem);
        });
    }

    async downloadPresentation() {
        if (!this.downloadReady || !this.generatedPresentation) {
            this.showError('Presentation not ready for download');
            return;
        }

        try {
            const fileName = `Generated_Presentation_${new Date().toISOString().slice(0, 10)}.pptx`;
            await this.generatedPresentation.writeFile({ fileName });
        } catch (error) {
            console.error('Download error:', error);
            this.showError('Failed to download presentation. Please try again.');
        }
    }

    resetForm() {
        // Reset all form fields
        document.getElementById('textContent').value = '';
        document.getElementById('guidance').value = '';
        document.getElementById('provider').value = '';
        document.getElementById('apiKey').value = '';
        
        // Reset file upload
        this.removeFile();
        
        // Reset state
        this.currentSlides = [];
        this.downloadReady = false;
        this.generatedPresentation = null;
        
        // Hide results section
        document.getElementById('resultsSection').style.display = 'none';
        
        // Update UI
        this.updateCharCount();
        this.validateForm();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showError(message) {
        document.getElementById('errorMessage').innerHTML = message.replace(/\n/g, '<br>');
        document.getElementById('errorModal').classList.remove('hidden');
    }

    hideError() {
        document.getElementById('errorModal').classList.add('hidden');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new PresentationGenerator();
});