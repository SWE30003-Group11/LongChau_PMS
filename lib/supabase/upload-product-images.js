const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Replace with your actual Supabase URL and Service Role Key
const SUPABASE_URL = 'https://zcorilynbkzpidniajuk.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjb3JpbHluYmt6cGlkbmlhanVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU0Mjk4NSwiZXhwIjoyMDY1MTE4OTg1fQ.XdoYsVKA5DlPetB0r7xdyAyYffUfbVBBSGYpLpj8sOo'

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function uploadProductImages() {
  const productsDir = path.join(process.cwd(), 'public', 'products')
  
  try {
    // Read all files in the products directory
    const files = fs.readdirSync(productsDir)
    
    console.log(`Found ${files.length} files in public/products`)
    
    for (const fileName of files) {
      const filePath = path.join(productsDir, fileName)
      const fileBuffer = fs.readFileSync(filePath)
      
      console.log(`Uploading ${fileName}...`)
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, fileBuffer, {
          contentType: `image/${path.extname(fileName).slice(1)}`,
          upsert: true // This will overwrite if file already exists
        })
      
      if (error) {
        console.error(`Error uploading ${fileName}:`, error)
      } else {
        console.log(`✅ Successfully uploaded ${fileName}`)
      }
    }
    
    console.log('\n✨ Upload complete!')
    
    // List all uploaded files to verify
    const { data: uploadedFiles, error: listError } = await supabase.storage
      .from('product-images')
      .list()
    
    if (listError) {
      console.error('Error listing files:', listError)
    } else {
      console.log(`\n📁 Total files in bucket: ${uploadedFiles.length}`)
      uploadedFiles.forEach(file => {
        console.log(`   - ${file.name}`)
      })
    }
    
  } catch (error) {
    console.error('Script error:', error)
  }
}

// Mapping function to help match CSV data with actual files
function createImageMapping() {
  const productsDir = path.join(process.cwd(), 'public', 'products')
  const files = fs.readdirSync(productsDir)
  
  console.log('\n📝 Image File Mapping:')
  console.log('Product Name → Image File')
  console.log('=' * 50)
  
  files.forEach(fileName => {
    const productName = path.basename(fileName, path.extname(fileName))
    console.log(`"${productName}" → ${fileName}`)
  })
}

// Run the script
if (require.main === module) {
  console.log('🚀 Starting product image upload to Supabase...')
  console.log('Make sure to replace SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY with your actual values\n')
  
  // Show mapping first
  createImageMapping()
  
  // Then upload (comment out the line below until you've set your Supabase credentials)
  // uploadProductImages()
}

module.exports = { uploadProductImages, createImageMapping } 