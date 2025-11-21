// import 'src/global.css';
// import { Buffer } from 'buffer';
// import Fab from '@mui/material/Fab';

// import { Router } from 'src/routes/sections';

// import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

// import { ThemeProvider } from 'src/theme/theme-provider';

// import { Iconify } from 'src/components/iconify';


// // ----------------------------------------------------------------------
// window.Buffer = Buffer;
// export default function App() {
//   useScrollToTop();

//   const githubButton = (
//     <Fab
//       size="medium"
//       aria-label="Github"
//       href="https://github.com/minimal-ui-kit/material-kit-react"
//       sx={{
//         zIndex: 9,
//         right: 20,
//         bottom: 20,
//         width: 44,
//         height: 44,
//         position: 'fixed',
//         bgcolor: 'grey.800',
//         color: 'common.white',
//       }}
//     >
//       <Iconify width={24} icon="eva:github-fill" />
//     </Fab>
//   );

//   return (
//     <ThemeProvider>
//       <Router />
//       {githubButton}
//     </ThemeProvider>
//   );
// }
// src/app.tsx
import 'src/global.css';
import { Buffer } from 'buffer';
import Fab from '@mui/material/Fab';
import { Router } from 'src/routes/sections';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { ThemeProvider } from 'src/theme/theme-provider';
import { Iconify } from 'src/components/iconify';
import { RecoilRoot } from 'recoil'; // Import RecoilRoot

// ----------------------------------------------------------------------
window.Buffer = Buffer;

export default function App() {
  useScrollToTop();

  const githubButton = (
    <Fab
      size="medium"
      aria-label="Github"
      href="https://github.com/minimal-ui-kit/material-kit-react"
      sx={{
        zIndex: 9,
        right: 20,
        bottom: 20,
        width: 44,
        height: 44,
        position: 'fixed',
        bgcolor: 'grey.800',
        color: 'common.white',
      }}
    >
      <Iconify width={24} icon="eva:github-fill" />
    </Fab>
  );

  return (
    <RecoilRoot> {/* Wrap the app with RecoilRoot */}
      <ThemeProvider>
        <Router />
        {/* {githubButton} */}
      </ThemeProvider>
    </RecoilRoot>
  );
}