import { currentUser } from '@clerk/nextjs/server';

const HomePage = async () => {
  const user = await currentUser();

  if (!user) {
    return console.error('User not found');
  }

  return (
    <main>
      <h2>Welcome, {user.firstName}</h2>
    </main>
  );
};

export default HomePage;
