const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='mt-auto bg-base-300 py-4 text-center'>
      <p className='text-sm text-gray-600'>
        &copy; {currentYear} CtrlAltElite Team. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
