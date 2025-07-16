import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturedBlogs from '@/components/Blog/Featured/Blogs';
import ResponsibleGambling from '@/components/ResponsibleGambling';
import Footer from '@/components/Footer';

const Index = () => {
  console.log('Casino homepage loaded');
  
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturedBlogs />
        <ResponsibleGambling />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
