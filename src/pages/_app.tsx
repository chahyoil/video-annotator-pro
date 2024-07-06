import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import Layout from '@components/Layout'
import '@styles/globals.css'

const theme = {
    colors: {
        primary: '#0070f3',
    },
}

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <Layout showSidebar={pageProps.showSidebar} videos={pageProps.videos}>
                <Component {...pageProps} />
            </Layout>
        </ThemeProvider>
    )
}

export default MyApp

