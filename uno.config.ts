import { defineConfig, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [presetWind3()],
  cli: {
    entry: {
      patterns: [
        'src/**/*.html',
        'src/**/*.ts',
        // Optional: 'src/**/*.scss' 
      ],      
      outFile: 'src/app/style/uno.css'
    }
  },
})