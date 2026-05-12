const signUpButton=document.getElementById('signUpButton');
const signInButton=document.getElementById('signInButton');
const signInForm=document.getElementById('signIn');
const signUpForm=document.getElementById('signup');

signUpButton.addEventListener('click',function(){
    signInForm.style.display="none";
    signUpForm.style.display="block";
})
signInButton.addEventListener('click', function(){
    signInForm.style.display="block";
    signUpForm.style.display="none";
})

// View Details functionality for Section1 pages
document.addEventListener('DOMContentLoaded', function() {
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const propertyItem = this.closest('.property-item');
            const propertyTitle = propertyItem.querySelector('h2').textContent;
            const detailsSection = propertyItem.querySelector('.property-more-details');
            
            // Create popup window with property details
            const popup = window.open('', '_blank', 'width=600,height=600');
            popup.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${propertyTitle} - Details</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            padding: 20px;
                            line-height: 1.6;
                        }
                        h1 { color: #333; }
                        .property-image {
                            max-width: 100%;
                            height: auto;
                            margin-bottom: 15px;
                        }
                        .detail-item {
                            margin-bottom: 10px;
                        }
                        strong {
                            color: #555;
                        }
                    </style>
                </head>
                <body>
                    <h1>${propertyTitle}</h1>
                    ${detailsSection.innerHTML}
                </body>
                </html>
            `);
            popup.document.close();
        });
    });
});
