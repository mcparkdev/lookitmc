# %%
from selenium.webdriver.support.expected_conditions import visibility_of_element_located
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import json
import time

import csv
import requests
from bs4 import BeautifulSoup

from operator import itemgetter

from .models import Item

# %%


def searchItem(input="Nevera Samsung", include=[], exclude=[], ascending=True, criteria="price"):
    if not include:
        stores = ["falabella",
                  "alkosto",
                  "ktronix",
                  "jumbo",
                  "exito",
                  "pricesmart"]
    else:
        stores = include
    if not exclude:
        for store in exclude:
            stores.remove(store)

    items = []
    if "falabella" in stores:
        items = [*items, *falabella(input)]
        print(f'{len(items)} items found')
    if "alkosto" in stores:
        items = [*items, *alkosto(input)]
        print(f'{len(items)} items found')
    if "ktronix" in stores:
        items = [*items, *ktronix(input)]
        print(f'{len(items)} items found')
    if "jumbo" in stores:
        items = [*items, *jumbo(input)]
        print(f'{len(items)} items found')
    if "exito" in stores:
        items = [*items, *exito(input)]
        print(f'{len(items)} items found')
    if "pricesmart" in stores:
        items = [*items, *pricesmart(input)]
        print(f'{len(items)} items found')

    items = sorted(items, key=itemgetter(criteria), reverse=(not ascending))
    # with open(f'/static/items/{input}.json', 'w', encoding='utf8') as fp:
    #     json.dump(items, fp, ensure_ascii=False)
    return items

# %%


def falabella(input="Macbook Pro", case_sensitive=False, strict=True):
    options = Options()
    options.headless = True
    options.add_argument("--window-size=1920,1200")

    DRIVER_PATH = 'C:/Windows/chromedriver'
    driver = webdriver.Chrome(options=options, executable_path=DRIVER_PATH)
    # driver = webdriver.Chrome(executable_path=DRIVER_PATH)
    url = f'https://www.falabella.com.co/falabella-co/search?Ntt={input}'
    driver.get(url)
    for i in range(20):  # scroll 3000 times
        ActionChains(driver).send_keys(Keys.PAGE_DOWN).perform()
        # time.sleep(1)
    # driver.find_element_by_tag_name('body').send_keys(Keys.PAGE_DOWN)

    # delay = 30  # seconds
    # myElem = WebDriverWait(driver, delay)
    # try:
    #     myElem = WebDriverWait(driver, delay).until(
    #         EC.presence_of_element_located((By.XPATH, "//*[@class='jsx-2487856160']")))
    #     print("Page is ready!")
    # except TimeoutException:
    #     print("Loading took too much time!")
    # else:
    #     html = driver.page_source
    # finally:
    #     driver.quit()
    html = driver.page_source
    if html:
        soup = BeautifulSoup(html, 'html.parser')
    try:
        search = soup.find('div', id='testId-searchResults-products')
        site = 'a'
        item = []
        item = search.find_all(
            'div', class_="jsx-3773340100 jsx-3886284353 pod pod-4_GRID")
        if not item:
            item = search.find_all(
                'div', class_="jsx-1395131234 search-results-4-grid")
        if not item:
            item = search.find_all(
                'div', class_="jsx-1395131234 search-results-list")
            site = 'b'
    except:
        print("Page Unavailable")
        return []
    if not item:
        print("No items found")
        return []
    products = []
    for i in range(0, len(item)):
        try:
            exists = True
            if (site == "a"):
                description = item[i].find(
                    'div', class_="jsx-3773340100 jsx-3886284353 pod-details pod-details-4_GRID").find_all('b')
                price = item[i].find('span', class_='copy1 primary high jsx-185326735 normal').text.rstrip(
                    "(Precio final)").lstrip("$").strip()
                price = int(float(price.replace(".", "").replace(",", ".")))
            else:
                description = item[i].find_all('b')
                price = item[i].find('span', class_='copy4 primary jsx-185326735 normal').text.rstrip(
                    "(Precio final)").lstrip("$").strip()
                price = int(float(price.replace(".", "").replace(",", ".")))

            if (strict):
                if (case_sensitive and input not in description[1].text):
                    exists = False
                elif (input.lower() not in description[1].text.lower()):
                    exists = False
            if (exists):
                products.append({
                    # 'input': input,
                    'brand': description[0].text,
                    'name': description[1].text,
                    'price': price,
                    'link': item[i].a['href'],
                    'store': 'Falabella',
                    'imageURL': item[i].find("img")['src'],
                    'logo': "https://lh3.googleusercontent.com/_G7AjsytG3O0gkXyditshL9B2tbT33Ou5Um7l9Tww5XhRavYJ_gTExcDMHRT3413m8s",
                })
        except:
            pass
    return products


# falabella()
# %%


def alkosto(input="Macbook Pro", case_sensitive=False, strict=True):
    options = Options()
    options.headless = True
    options.add_argument("--window-size=1920,1200")

    DRIVER_PATH = 'C:/Windows/chromedriver'
    driver = webdriver.Chrome(options=options, executable_path=DRIVER_PATH)
    url = f'https://www.alkosto.com/salesperson/result/?q={input}'
    driver.get(url)
    for i in range(20):  # scroll 3000 times
        ActionChains(driver).send_keys(Keys.PAGE_DOWN).perform()
    html = driver.page_source
    if html:
        soup = BeautifulSoup(html, 'html.parser')

    # URL = f'https://www.alkosto.com/salesperson/result/?q={input}'
    # source = requests.get(URL)
    # soup = BeautifulSoup(source.content, 'html.parser')
    try:
        items = soup.find('ul', class_="products-grid")
        if not items:
            items = soup.find('ul', class_="products-grid first last odd")
    except:
        print("Page Unavailable")
        return []
    if not items:
        print("No items found")
        return []
    item = []
    for product in items.find_all('li'):
        item.append(product)

    products = []
    for i in range(0, len(item)):
        exists = True
        try:
            name = item[i].h2.text.strip().replace("\xa0", " ")
            price = item[i].find(
                'span', class_="price").span.text.strip().lstrip("$\xa0").strip()
            price = int(float(price.replace(".", "").replace(",", ".")))
            if (strict):
                if (case_sensitive and input not in name):
                    exists = False
                elif (input.lower() not in name.lower()):
                    exists = False
            if (exists):
                products.append({
                    # 'input': input,
                    'brand': 'NA',
                    'name': name,
                    'price': price,
                    'link': item[i].h2.a['href'],
                    'store': 'Alkosto',
                    'imageURL': item[i].find("img")['src'],
                    'logo': "https://image.winudf.com/v2/image/Y29tLm1vYmluY3ViZS5rcGFjaXRhdGUuc2NfSFFNNFcyX2ljb25fMTUyMTEwODk1MV8wOTE/icon.png?w=170&fakeurl=1"
                })
        except:
            pass
    return products


# alkosto('Nevera')

# %%


def ktronix(input="Macbook Pro", case_sensitive=False, strict=True):
    options = Options()
    options.headless = True
    options.add_argument("--window-size=1920,1200")

    DRIVER_PATH = 'C:/Windows/chromedriver'
    driver = webdriver.Chrome(options=options, executable_path=DRIVER_PATH)
    url = f'https://www.ktronix.com/salesperson/result/?q={input}'
    driver.get(url)
    for i in range(20):  # scroll 3000 times
        ActionChains(driver).send_keys(Keys.PAGE_DOWN).perform()
    html = driver.page_source
    if html:
        soup = BeautifulSoup(html, 'html.parser')
    # URL = f'https://www.alkosto.com/salesperson/result/?q={input}'
    # source = requests.get(URL)
    # soup = BeautifulSoup(source.content, 'html.parser')
    try:
        items = soup.find('ul', class_="products-grid")
        if not items:
            items = soup.find('ul', class_="products-grid first last odd")
    except:
        print("Page Unavailable")
        return []
    if not items:
        print("No items found")
        return []
    item = []
    for product in items.find_all('li'):
        item.append(product)

    products = []
    for i in range(0, len(item)):
        exists = True
        try:
            name = item[i].h2.text.strip().replace("\xa0", " ")
            price = item[i].find(
                'span', class_="price").span.text.strip().lstrip("$\xa0").strip()
            price = int(float(price.replace(".", "").replace(",", ".")))
            if (strict):
                if (case_sensitive and input not in name):
                    exists = False
                elif (input.lower() not in name.lower()):
                    exists = False
            if (exists):
                products.append({
                    # 'input': input,
                    'brand': 'NA',
                    'name': name,
                    'price': price,
                    'link': item[i].h2.a['href'],
                    'store': 'Ktronix',
                    'imageURL': item[i].find("img")['src'],
                    'logo': 'https://www.brilladegasesdeoccidente.com/imagenes/provedores/3525_logo_Ktronix_Nuevo_2018_Final.png',
                })
        except:
            pass
    return products


# ktronix('Nevera')
# %%


def jumbo(input="Nevera Samsung", case_sensitive=False, strict=True):
    URL = f"https://www.tiendasjumbo.co/busca/?ft={input}"
    source = requests.get(URL)
    soup = BeautifulSoup(source.content, 'html.parser')

    try:
        item = soup.find_all('div', class_="product-item__bottom")
        itemImage = soup.find_all('div', class_="product-item__image-wrapper")
    except:
        print("Page Unavailable")
        return []
    if not item:
        print("No items found")
        return []

    products = []
    for i in range(0, len(item)):
        try:
            exists = True
            if (strict):
                if (case_sensitive and input not in item[i].find("a", class_="product-item__name").text):
                    exists = False
                elif (input.lower() not in item[i].find("a", class_="product-item__name").text.lower()):
                    exists = False
            price = item[i].find(
                "span", class_="product-prices__value product-prices__value--best-price").text.lstrip("$")
            price = int(float(price.replace(".", "").replace(",", ".")))
            if (exists):
                products.append({
                    # 'input': input,
                    'brand': item[i].find("div", class_="product-item__brand").text,
                    'name': item[i].find("a", class_="product-item__name").text,
                    'price': price,
                    'link': item[i].find("a", class_="product-item__name")['href'],
                    'store': 'Jumbo',
                    'imageURL': itemImage[i].find("img")['src'],
                    'logo': "https://upload.wikimedia.org/wikipedia/commons/d/d3/Logo_Jumbo_Cencosud.png",
                })
        except:
            pass
    return products


# jumbo()

# %%


def exito(input="Nevera Samsung", case_sensitive=False, strict=True):
    options = Options()
    options.headless = True
    options.add_argument("--window-size=1920,1200")

    DRIVER_PATH = 'C:/Windows/chromedriver'
    driver = webdriver.Chrome(options=options, executable_path=DRIVER_PATH)
    # driver = webdriver.Chrome(executable_path=DRIVER_PATH)
    url = f"https://www.exito.com/search?_query={input}"
    driver.get(url)

    delay = 30  # seconds
    try:
        myElem = WebDriverWait(driver, delay).until(
            EC.presence_of_element_located((By.XPATH, "//*[@class='vtex-store-components-3-x-productBrand f6 fw5 shelfProductName search-result-exito-product-summary-name-product']")))
        print("Page is ready!")
    except TimeoutException:
        print("Loading took too much time!")
        return []
    else:
        html = driver.page_source
    finally:
        driver.quit()
    if html:
        soup = BeautifulSoup(html, 'html.parser')

    try:
        item = soup.find_all(
            'a', class_="vtex-product-summary-2-x-clearLink h-100 flex flex-column")
    except:
        print("Page Unavailable")
        return []
    if not item:
        print("No items found")
        return []

    products = []
    for i in range(0, len(item)):
        try:
            exists = True
            name = item[i].find(
                "span", class_="vtex-store-components-3-x-productBrand f6 fw5 shelfProductName search-result-exito-product-summary-name-product").text
            if (strict):
                if (case_sensitive and input not in name):
                    exists = False
                elif (input.lower() not in name.lower()):
                    exists = False
            price = item[i].find(
                'div', class_="flex f5 fw5 pa0 flex items-center justify-start w-100 search-result-exito-vtex-components-selling-price exito-vtex-components-4-x-alliedDiscountPrice").text.lstrip("$\xa0")
            price = int(float(price.replace(".", "").replace(",", ".")))
            if (exists):
                products.append({
                    # 'input': input,
                    'brand': "NA",
                    'name': name,
                    'price': price,
                    'link': f"https://www.exito.com{item[i]['href']}",
                    'store': 'Exito',
                    'imageURL': item[i].find("img")['src'],
                    'logo': "https://pluspng.com/img-png/almacenes-exito-logo-png-open-2000.png",
                })
        except:
            pass
    return products


# exito()

# %%


def pricesmart(input="Nevera", case_sensitive=False, strict=True):
    URL = f"https://www.pricesmart.com/site/co/es/busqueda?_sq={input}"
    source = requests.get(URL)
    soup = BeautifulSoup(source.content, 'html.parser')
    try:
        item = soup.find_all(
            'div', class_="col-xs-12 col-sm-6 col-md-6 col-lg-3 px-3 px-sm-2 px-md-2 px-lg-2")
    except:
        return []
    if not item:
        return [{"error": "no items found"}]

    products = []
    for i in range(0, len(item)):
        try:
            exists = True
            name = item[i].find(
                "p", class_="search-product-description").text.strip()
            if (strict):
                if (case_sensitive and input not in name):
                    exists = False
                elif (input.lower() not in name.lower()):
                    exists = False
            price = item[i].find("strong", class_="currency").text.strip()
            price = int(float(price.replace(".", "").replace(",", ".")))
            if (exists):
                products.append({
                    # 'input': input,
                    'brand': "NA",
                    'name': name,
                    'price': price,
                    'link': f"https://www.pricesmart.com{item[i].find('a')['href']}",
                    'store': 'PriceSmart',
                    'imageURL': item[i].find("img")['src'],
                    'logo': "https://lh3.googleusercontent.com/JxrFCU5y1RkxddxRzQ7VreSGNNGg-rID_HWC8n1t0ISaX5GPF1l47Ar3ED5QzKMuPwM",
                })
        except:
            pass
    return products


# pricesmart()
# %%
