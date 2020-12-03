# SODA docs

We use Sphinx to generate the HTML for the SODA documentation. To build the docs, first install Sphinx.
    
    pip install sphinx

Once Sphinx is installed, you'll need to install the sphinx_rtd_theme from PyPI
    
    pip install sphinx_rtd_theme
   
Next, you can build the HTML by running

    make html
    
Then, open
    
    build/html/index.html
