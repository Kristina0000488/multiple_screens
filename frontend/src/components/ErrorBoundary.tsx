import React, { ReactNode } from 'react';


export class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: Boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
      }
    
    static getDerivedStateFromError(error: any) {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error(error, 'error boundary!')
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong</h1>;
        }

        return this.props.children; 
    }
}

