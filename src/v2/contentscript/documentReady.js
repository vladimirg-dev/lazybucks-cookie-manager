export async function documentReady() {
    return new Promise((resolve) => {
        if (document.readyState === 'complete' || (document.readyState !== 'loading')) {
            resolve();
        } else {
            document.addEventListener('DOMContentLoaded', resolve);
        }
    });
}
