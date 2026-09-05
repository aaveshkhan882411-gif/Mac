const fs = require('fs');
const path = require('path');

class UltraDatabase {
    constructor(baseDir = './mac-storage') {
        this.baseDir = path.resolve(baseDir);
        if (!fs.existsSync(this.baseDir)) {
            fs.mkdirSync(this.baseDir, { recursive: true });
        }
        this.maxItemsPerUltra = 1000; // हर अल्ट्रा यूनिट की लिमिट
    }

    getCurrentUltraFile() {
        const files = fs.readdirSync(this.baseDir).filter(f => f.startsWith('ultra-') && f.endsWith('.json'));
        files.sort();
        if (files.length === 0) {
            return path.join(this.baseDir, 'ultra-1.json');
        }
        return path.join(this.baseDir, files[files.length - 1]);
    }

    saveData(key, value) {
        let currentFile = this.getCurrentUltraFile();
        let data = {};

        if (fs.existsSync(currentFile)) {
            data = JSON.parse(fs.readFileSync(currentFile, 'utf8'));
        }

        const keys = Object.keys(data);
        if (keys.length >= this.maxItemsPerUltra) {
            // लिमिट पूरी होने पर नया अल्ट्रा बनाओ (जैसे Ultra-2, Ultra-3)
            const fileNumber = parseInt(path.basename(currentFile).replace('ultra-', '').replace('.json', '')) + 1;
            currentFile = path.join(this.baseDir, `ultra-${fileNumber}.json`);
            data = {};
        }

        data[key] = {
            value: value,
            timestamp: new Date().toISOString()
        };

        fs.writeFileSync(currentFile, JSON.stringify(data, null, 2));
        console.log(`[ULTRA DB]: Data saved successfully to ${path.basename(currentFile)}`);
    }

    getData(key) {
        const files = fs.readdirSync(this.baseDir).filter(f => f.startsWith('ultra-') && f.endsWith('.json'));
        for (const file of files) {
            const filePath = path.join(this.baseDir, file);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (data[key]) {
                return data[key];
            }
        }
        return null;
    }
}

module.exports = UltraDatabase;
