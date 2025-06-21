# Custom Domain Setup Guide for TellYouSomeday

## 🌐 Connecting Your Namecheap Domain to DigitalOcean

### Prerequisites
- ✅ Your app is deployed on DigitalOcean: https://tellyousomeday-pen2p.ondigitalocean.app
- ✅ You have a domain registered with Namecheap
- ✅ Access to Namecheap DNS management

### Step 1: Configure Domain in DigitalOcean

1. **Open DigitalOcean Console**:
   - Go to https://cloud.digitalocean.com/apps
   - Find your `tellyousomeday` app
   - Click on it to open the app details

2. **Add Custom Domain**:
   - Go to the "Settings" tab
   - Scroll down to "Domains" section
   - Click "Add Domain"
   - Enter your domain name (e.g., `yourdomain.com`)
   - Choose whether to add both `yourdomain.com` and `www.yourdomain.com`
   - Click "Add Domain"

3. **Get DNS Records**:
   - DigitalOcean will provide DNS records you need to add
   - You'll see something like:
     ```
     Type: A
     Name: @
     Value: [IP_ADDRESS]
     
     Type: CNAME
     Name: www
     Value: [APP_DOMAIN].ondigitalocean.app
     ```

### Step 2: Configure DNS in Namecheap

1. **Login to Namecheap**:
   - Go to https://www.namecheap.com
   - Login to your account
   - Go to "Domain List"

2. **Access DNS Management**:
   - Find your domain
   - Click "Manage" next to it
   - Go to "Advanced DNS" tab

3. **Add DNS Records**:
   - Delete any existing A or CNAME records for @ and www
   - Add the records provided by DigitalOcean:

   **For Root Domain (yourdomain.com):**
   ```
   Type: A Record
   Host: @
   Value: [IP from DigitalOcean]
   TTL: Automatic
   ```

   **For WWW Subdomain (www.yourdomain.com):**
   ```
   Type: CNAME Record
   Host: www
   Value: [APP_DOMAIN].ondigitalocean.app
   TTL: Automatic
   ```

### Step 3: SSL Certificate Setup

DigitalOcean will automatically:
- Generate a free SSL certificate (Let's Encrypt)
- Configure HTTPS for your domain
- Redirect HTTP to HTTPS

This process usually takes 5-15 minutes after DNS propagation.

### Step 4: Verification

1. **Check DNS Propagation**:
   - Use https://dnschecker.org
   - Enter your domain name
   - Check if A and CNAME records are propagating globally

2. **Test Your Domain**:
   - Wait 15-30 minutes for DNS propagation
   - Visit `https://yourdomain.com`
   - Verify your app loads correctly
   - Test all functionality (create, search, read messages)

### Common Domain Configurations

**Option 1: Primary domain with www redirect**
- Main: `yourdomain.com` → Your app
- Redirect: `www.yourdomain.com` → `yourdomain.com`

**Option 2: WWW as primary with root redirect**
- Main: `www.yourdomain.com` → Your app  
- Redirect: `yourdomain.com` → `www.yourdomain.com`

**Option 3: Both domains work independently**
- Both `yourdomain.com` and `www.yourdomain.com` → Your app

### Troubleshooting

**If domain doesn't work after 30 minutes:**

1. **Check DNS Records**:
   ```bash
   nslookup yourdomain.com
   nslookup www.yourdomain.com
   ```

2. **Verify DigitalOcean Settings**:
   - Ensure domain is added correctly in DigitalOcean
   - Check if SSL certificate is being generated

3. **Check Namecheap DNS**:
   - Ensure you're using Namecheap BasicDNS (not third-party)
   - Verify records are saved correctly
   - Check TTL settings

**Common Issues:**
- **DNS not propagating**: Wait longer (up to 24 hours)
- **SSL certificate pending**: Normal, takes 5-15 minutes
- **Mixed content warnings**: App should handle HTTPS automatically

### Benefits of Custom Domain

✅ **Professional appearance**: `yourdomain.com` vs `app-name.ondigitalocean.app`
✅ **Brand recognition**: Users remember your domain
✅ **SEO benefits**: Better search engine optimization
✅ **Email setup**: Can add email services later
✅ **Future flexibility**: Easy to move hosting if needed

### Next Steps After Domain Setup

1. **Update Social Links**: Update any shared links to use new domain
2. **Analytics**: Set up Google Analytics with new domain
3. **Email**: Consider adding professional email (e.g., contact@yourdomain.com)
4. **Monitoring**: Update any monitoring services with new domain

## 📋 Quick Checklist

- [ ] Domain registered with Namecheap
- [ ] DigitalOcean app is working
- [ ] Add domain in DigitalOcean app settings
- [ ] Copy DNS records from DigitalOcean
- [ ] Add DNS records in Namecheap
- [ ] Wait for DNS propagation (15-30 mins)
- [ ] Test domain works with HTTPS
- [ ] Verify all app functionality

Need help with any of these steps? Let me know your domain name and I can provide more specific guidance!
