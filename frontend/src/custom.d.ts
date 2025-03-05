// Module declarations for components and pages
declare module './App' {
  const App: React.FC;
  export default App;
}

declare module './pages/Puzzle' {
  const Puzzle: React.FC;
  export default Puzzle;
}

declare module './pages/Profile' {
  const Profile: React.FC;
  export default Profile;
}

declare module './pages/NotFound' {
  const NotFound: React.FC;
  export default NotFound;
}

declare module './components/Footer' {
  const Footer: React.FC;
  export default Footer;
}

declare module './context/AuthContext' {
  export const AuthProvider: React.FC<{children: React.ReactNode}>;
} 