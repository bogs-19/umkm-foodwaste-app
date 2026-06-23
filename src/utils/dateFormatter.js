export const formatDate = (dateValue) => {
    if (!dateValue) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateValue).toLocaleDateString('id-ID', options);
};