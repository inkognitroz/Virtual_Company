#!/usr/bin/env node

/**
 * Database initialization script
 * Run this to verify MongoDB connection and create indexes
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/virtual-company';

async function initializeDatabase() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        console.log('URI:', MONGODB_URI.replace(/:[^:@]+@/, ':***@')); // Hide password
        
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB successfully!\n');
        
        // Get database info
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        
        console.log('📊 Database Information:');
        console.log('Database Name:', db.databaseName);
        console.log('Collections:', collections.length > 0 ? collections.map(c => c.name).join(', ') : 'None (empty database)');
        console.log('');
        
        // Load models to ensure indexes are created
        console.log('📝 Creating indexes...');
        require('../models/User');
        require('../models/Role');
        require('../models/Message');
        
        // Ensure indexes
        await mongoose.connection.syncIndexes();
        console.log('✓ Indexes created successfully!');
        console.log('');
        
        // Get collection stats
        if (collections.length > 0) {
            console.log('📈 Collection Statistics:');
            for (const collection of collections) {
                const stats = await db.collection(collection.name).countDocuments();
                console.log(`  ${collection.name}: ${stats} documents`);
            }
        }
        
        console.log('\n✅ Database initialization complete!');
        
    } catch (error) {
        console.error('❌ Database initialization failed:');
        console.error(error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

// Run initialization
initializeDatabase();
