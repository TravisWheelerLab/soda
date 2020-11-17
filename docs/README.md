# SODA docs

We use Sphinx to generate the HTML for the SODA documentation. To build the docs, first install Sphinx.

macOS
  
    brew install sphinx-doc
    
For linux, use your distribution's package manager. If it's not available there, Sphinx is available on PyPI and can be installed with pip.
    
    pip install -U Sphinx

Once Sphinx is installed, run

    make html
    
Then, open
    
    build/html/index.html
