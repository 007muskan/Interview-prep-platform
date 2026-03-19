# Contributing to Career Intelligence Platform

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Submitting Changes](#submitting-changes)
6. [Feature Requests](#feature-requests)
7. [Bug Reports](#bug-reports)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## Getting Started

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/your-username/ai-career-copilot.git
cd ai-career-copilot
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/original-owner/ai-career-copilot.git
```

### Set Up Development Environment

Follow the [SETUP.md](SETUP.md) guide to set up your local development environment.

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 2. Make Changes

- Write clean, readable code
- Follow the coding standards below
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Test the application
npm run dev
```

### 4. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add resume export functionality"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use meaningful variable names

```typescript
// Good
interface UserProfile {
  id: string
  name: string
  email: string
}

// Avoid
const data: any = {}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types

```typescript
// Good
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: "primary" | "secondary"
}

export function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return (
    <button onClick={onClick} className={variant}>
      {label}
    </button>
  )
}
```

### API Routes

- Validate input data
- Handle errors properly
- Return consistent response formats
- Add authentication checks

```typescript
// Good
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    // Process data...

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow the existing design system
- Keep styles consistent across components
- Use shadcn/ui components when possible

```typescript
// Good
<div className="flex items-center gap-4 p-6 rounded-lg border bg-white">
  <Icon className="h-5 w-5 text-primary" />
  <span className="text-sm font-medium">Label</span>
</div>
```

### Database

- Use Prisma for database operations
- Write efficient queries
- Add proper indexes
- Handle errors gracefully

```typescript
// Good
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    name: true,
    email: true,
  }
})

if (!user) {
  throw new Error("User not found")
}
```

## Submitting Changes

### Pull Request Guidelines

1. **Title**: Clear and descriptive
   - Good: "Add resume export to PDF feature"
   - Bad: "Update files"

2. **Description**: Include:
   - What changes were made
   - Why the changes were needed
   - How to test the changes
   - Screenshots (if UI changes)

3. **Checklist**:
   - [ ] Code follows project style guidelines
   - [ ] Tests added/updated
   - [ ] Documentation updated
   - [ ] No console errors
   - [ ] Tested locally

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged

## Feature Requests

To request a new feature:

1. Check if it's already requested in Issues
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach
   - Mockups or examples (if applicable)

## Bug Reports

To report a bug:

1. Check if it's already reported
2. Create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots or error messages
   - Environment details (OS, browser, etc.)

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS, Windows]
- Browser: [e.g. Chrome, Firefox]
- Version: [e.g. 1.0.0]

**Additional context**
Any other context about the problem.
```

## Areas for Contribution

### High Priority

- [ ] Add more interview question categories
- [ ] Improve resume parsing accuracy
- [ ] Add email notifications
- [ ] Implement analytics dashboard
- [ ] Add more AI models support

### Good First Issues

- [ ] Improve error messages
- [ ] Add loading states
- [ ] Enhance mobile responsiveness
- [ ] Add more unit tests
- [ ] Improve documentation

### Advanced Features

- [ ] Real-time collaboration
- [ ] Video interview practice
- [ ] Job board integration
- [ ] Payment integration
- [ ] Mobile app

## Questions?

- Open a GitHub Discussion
- Create an issue with the "question" label
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

Thank you for contributing! 🎉
