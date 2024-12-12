console.log(currentPage)
function changePage(page) {
  if (page === 'prev' && currentPage > 1) {
    currentPage--;
  } else if (page === 'next' && currentPage < totalPages) {
    currentPage++;
  }

  window.location.href = `/solana/${currentPage}`;
}